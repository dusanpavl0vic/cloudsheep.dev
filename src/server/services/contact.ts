import 'server-only'

import type { Prisma } from '@prisma/client'

import type { ConfirmStatus } from '@/constants/confirmation'
import { HTTP_STATUS } from '@/constants/http'
import { isLocale, type Locale } from '@/constants/i18n'
import { ROUTES } from '@/constants/routes'
import type { Brief } from '@/schemas/contact'
import type { AdminMessage, AdminMessageList, EmailCheckResult } from '@/types/contact'

import { confirmLink, createConfirmToken, hashConfirmToken, linkCutoff, purgeCutoff } from '../confirmation'
import { prisma } from '../db'
import { verifyEmail } from '../email-verification'
import { HttpError } from '../http'
import { log } from '../log'
import { earliestBookable, freeSlotWhere } from './booking'
import { sendAutoReply, sendStudioMail, type BriefMail } from '../mail/briefMails'
import { sendBriefConfirmation } from '../mail/confirmMails'

/** Provera adrese dok posetilac kuca — isti postupak kao pri slanju (ADR 0013). */
export const checkEmail = async (email: string, allowTypo: boolean): Promise<EmailCheckResult> => {
  const verdict = await verifyEmail(email, { allowTypo })
  return verdict.ok
    ? { ok: true }
    : { ok: false, reason: verdict.reason, suggestion: verdict.suggestion }
}

/** Adresa koja ne može da primi poštu je greška NA POLJU, sa predlogom ispravke kad ga ima. */
export const assertDeliverable = async (email: string, allowTypo: boolean) => {
  const verdict = await verifyEmail(email, { allowTypo })
  if (verdict.ok) return verdict.email
  throw new HttpError(HTTP_STATUS.UNPROCESSABLE, `email.errors.${verdict.reason}`, {
    field: 'email',
    ...(verdict.suggestion ? { suggestion: verdict.suggestion } : {}),
  })
}

interface RequestMeta {
  ip: string
  userAgent: string | null
}

/** Nepotvrđeni upiti stariji od 7 dana se brišu — lični podaci bez saglasnosti (ADR 0016). */
const purgeUnconfirmed = () =>
  prisma.contactMessage.deleteMany({ where: { confirmedAt: null, createdAt: { lt: purgeCutoff() } } })

/**
 * Upit iz forme u tri koraka — NE stiže studiju dok posetilac ne potvrdi adresu (ADR 0016).
 *
 * 1. Honeypot popunjen → tiho ništa (pozivalac i dalje vraća 202 — bot ne dobija signal).
 * 2. Adresa mora da prima poštu (MX) — inače 422 na polju `email`, BEZ upisa i slanja.
 * 3. U JEDNOJ transakciji: upis nepotvrđene poruke + atomično zauzimanje termina (drži se 24 h).
 *    Termin koji je u međuvremenu uzet → 409 na polju `slotId`, a poruka se ne upisuje.
 * 4. Mejl sa linkom za potvrdu. Ako ne ode, upit se briše i posetilac dobija 503 — bez potvrde
 *    upit nikad ne bi stigao, a posetilac bi mislio da jeste.
 */
export const submitBrief = async (brief: Brief, meta: RequestMeta) => {
  if (brief.website) return

  const email = await assertDeliverable(brief.email, brief.allowTypo)
  await purgeUnconfirmed()
  const { token, hash } = createConfirmToken()

  const { message, callAt } = await prisma.$transaction(async (tx) => {
    const created = await tx.contactMessage.create({
      data: {
        name: brief.name,
        email,
        message: brief.message,
        projectType: brief.projectType,
        budget: brief.budget,
        timeline: brief.timeline,
        locale: brief.locale,
        ...(brief.estimate ? { estimate: brief.estimate } : {}),
        confirmTokenHash: hash,
        ip: meta.ip,
        userAgent: meta.userAgent,
      },
    })

    if (!brief.slotId) return { message: created, callAt: null }

    // Atomično: uslov slobodnog termina je deo istog UPDATE-a, pa dva istovremena upita ne
    // mogu oba da dobiju termin — drugi dobija count 0 i transakcija se poništava.
    const reserved = await tx.bookingSlot.updateMany({
      where: { id: brief.slotId, startsAt: { gt: earliestBookable() }, ...freeSlotWhere() },
      data: { contactMessageId: created.id },
    })
    if (reserved.count === 0) {
      throw new HttpError(HTTP_STATUS.CONFLICT, 'contact.errors.slotTaken', { field: 'slotId' })
    }
    const slot = await tx.bookingSlot.findUniqueOrThrow({ where: { id: brief.slotId }, select: { startsAt: true } })
    return { message: created, callAt: slot.startsAt }
  })

  try {
    await sendBriefConfirmation({
      to: email,
      name: brief.name,
      locale: brief.locale,
      link: confirmLink(ROUTES.CONTACT_CONFIRM, brief.locale, token),
    })
  } catch (error) {
    log.error('mejl za potvrdu upita nije poslat', error)
    await prisma.contactMessage.delete({ where: { id: message.id } })
    throw new HttpError(HTTP_STATUS.SERVICE_UNAVAILABLE, 'contact.errors.mailFailed')
  }

  return { callAt }
}

type MessageRow = Prisma.ContactMessageGetPayload<{ include: { bookingSlot: { select: { startsAt: true } } } }>

const findByToken = (token: string) =>
  prisma.contactMessage.findUnique({
    where: { confirmTokenHash: hashConfirmToken(token) },
    include: { bookingSlot: { select: { startsAt: true } } },
  })

const statusOf = (message: MessageRow | null): 'pending' | ConfirmStatus => {
  if (!message) return 'invalid'
  if (message.confirmedAt) return 'confirmed'
  return message.createdAt < linkCutoff() ? 'expired' : 'pending'
}

/** Za stranicu potvrde (GET): šta se potvrđuje — bez ikakve izmene (skeneri pošte otvaraju linkove). */
export const getBriefForConfirmation = async (token: string) => {
  const message = await findByToken(token)
  const status = statusOf(message)
  return status === 'pending' && message
    ? {
        status,
        name: message.name,
        projectType: message.projectType,
        locale: message.locale,
        callAt: message.bookingSlot?.startsAt.toISOString() ?? null,
      }
    : { status }
}

/**
 * Potvrda (POST sa stranice): upit postaje vidljiv studiju, mejl studiju i kopija posetiocu.
 * Uslov `confirmedAt: null` je u istom UPDATE-u — dupli klik ne šalje dva mejla.
 */
export const confirmBrief = async (token: string): Promise<{ status: ConfirmStatus; locale: Locale }> => {
  const message = await findByToken(token)
  const status = statusOf(message)
  const locale: Locale = isLocale(message?.locale) ? message.locale : 'en'
  if (status !== 'pending' || !message) return { status: status === 'pending' ? 'invalid' : status, locale }

  const { count } = await prisma.contactMessage.updateMany({
    where: { id: message.id, confirmedAt: null },
    data: { confirmedAt: new Date() },
  })
  if (count === 0) return { status: 'confirmed', locale }

  const mail: BriefMail = {
    brief: {
      projectType: message.projectType as Brief['projectType'],
      budget: message.budget as Brief['budget'],
      timeline: message.timeline as Brief['timeline'],
      name: message.name,
      email: message.email,
      message: message.message,
      slotId: null,
      estimate: (message.estimate ?? null) as Brief['estimate'],
      locale,
      allowTypo: false,
    },
    callAt: message.bookingSlot?.startsAt ?? null,
  }

  // PRVO upis, PA slanje: pad SMTP-a ne gubi upit — greška se vidi u admin-u, na zapisu.
  try {
    await sendStudioMail(mail)
    await prisma.contactMessage.update({ where: { id: message.id }, data: { emailSentAt: new Date() } })
  } catch (error) {
    log.error('slanje upita studiju nije uspelo', error)
    await prisma.contactMessage.update({
      where: { id: message.id },
      data: { emailError: error instanceof Error ? error.message.slice(0, 500) : 'nepoznata greška' },
    })
  }

  // Zaseban `try`: problem sa posetiočevim sandučetom ne poništava zapis o kopiji studiju.
  try {
    await sendAutoReply(mail)
  } catch (error) {
    log.warn('automatska potvrda pošiljaocu nije poslata', error)
  }

  return { status: 'confirmed', locale }
}

// ─── Admin ────────────────────────────────────────────────────────────────────────

export const listMessages = async (status: 'all' | 'unread'): Promise<AdminMessageList> => {
  // Admin vidi samo potvrđene upite (ADR 0016).
  const confirmed = { confirmedAt: { not: null } } satisfies Prisma.ContactMessageWhereInput
  const [messages, unread] = await Promise.all([
    prisma.contactMessage.findMany({
      where: status === 'unread' ? { ...confirmed, isRead: false } : confirmed,
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: { bookingSlot: { select: { startsAt: true } } },
    }),
    prisma.contactMessage.count({ where: { ...confirmed, isRead: false } }),
  ])

  const items: AdminMessage[] = messages.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    projectType: m.projectType,
    budget: m.budget,
    timeline: m.timeline,
    locale: m.locale,
    bookedAt: m.bookingSlot?.startsAt.toISOString() ?? null,
    isRead: m.isRead,
    wasEmailed: m.emailSentAt !== null,
    emailError: m.emailError,
    createdAt: m.createdAt.toISOString(),
  }))
  return { items, unread }
}

export const markMessageRead = async (id: string, isRead: boolean) => {
  await prisma.contactMessage.update({ where: { id }, data: { isRead } })
}

/** Brisanje poruke oslobađa njen termin (`onDelete: SetNull`). */
export const deleteMessage = async (id: string) => {
  await prisma.contactMessage.delete({ where: { id } })
}
