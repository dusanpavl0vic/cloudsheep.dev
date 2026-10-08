import 'server-only'

import { HTTP_STATUS } from '@/constants/http'
import type { Brief } from '@/schemas/contact'
import type { AdminMessage, AdminMessageList, EmailCheckResult } from '@/types/contact'

import { prisma } from '../db'
import { verifyEmail } from '../email-verification'
import { HttpError } from '../http'
import { log } from '../log'
import { earliestBookable } from './booking'
import { sendAutoReply, sendStudioMail } from '../mail/briefMails'

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

/**
 * Upit iz forme u tri koraka.
 *
 * 1. Honeypot popunjen → tiho ništa (pozivalac i dalje vraća 202 — bot ne dobija signal).
 * 2. Adresa mora da prima poštu (MX) — inače 422 na polju `email`, BEZ upisa i slanja.
 * 3. U JEDNOJ transakciji: upis poruke + atomično zauzimanje termina. Termin koji je u
 *    međuvremenu uzet → 409 na polju `slotId`, a poruka se ne upisuje.
 * 4. PRVO upis, PA slanje: pad SMTP-a ne gubi poruku — greška se vidi u admin-u, na zapisu.
 */
export const submitBrief = async (brief: Brief, meta: RequestMeta) => {
  if (brief.website) return

  const email = await assertDeliverable(brief.email, brief.allowTypo)

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
        ip: meta.ip,
        userAgent: meta.userAgent,
      },
    })

    if (!brief.slotId) return { message: created, callAt: null }

    // Atomično: uslov `contactMessageId: null` je deo istog UPDATE-a, pa dva istovremena
    // upita ne mogu oba da dobiju termin — drugi dobija count 0 i transakcija se poništava.
    const reserved = await tx.bookingSlot.updateMany({
      where: { id: brief.slotId, contactMessageId: null, startsAt: { gt: earliestBookable() } },
      data: { contactMessageId: created.id },
    })
    if (reserved.count === 0) {
      throw new HttpError(HTTP_STATUS.CONFLICT, 'contact.errors.slotTaken', { field: 'slotId' })
    }
    const slot = await tx.bookingSlot.findUniqueOrThrow({
      where: { id: brief.slotId },
      select: { startsAt: true },
    })
    return { message: created, callAt: slot.startsAt }
  })

  const mail = { brief: { ...brief, email }, callAt }

  try {
    await sendStudioMail(mail)
    await prisma.contactMessage.update({
      where: { id: message.id },
      data: { emailSentAt: new Date() },
    })
  } catch (error) {
    log.error('slanje upita studiju nije uspelo', error)
    await prisma.contactMessage.update({
      where: { id: message.id },
      data: {
        emailError: error instanceof Error ? error.message.slice(0, 500) : 'nepoznata greška',
      },
    })
  }

  // Zaseban `try`: problem sa posetiočevim sandučetom ne poništava zapis o kopiji studiju.
  try {
    await sendAutoReply(mail)
  } catch (error) {
    log.warn('automatska potvrda pošiljaocu nije poslata', error)
  }
}

// ─── Admin ────────────────────────────────────────────────────────────────────────

export const listMessages = async (status: 'all' | 'unread'): Promise<AdminMessageList> => {
  const [messages, unread] = await Promise.all([
    prisma.contactMessage.findMany({
      ...(status === 'unread' ? { where: { isRead: false } } : {}),
      orderBy: { createdAt: 'desc' },
      take: 200,
      include: { bookingSlot: { select: { startsAt: true } } },
    }),
    prisma.contactMessage.count({ where: { isRead: false } }),
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
