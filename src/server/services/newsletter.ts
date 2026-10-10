import 'server-only'

import type { z } from 'zod'

import type { ConfirmStatus } from '@/constants/confirmation'
import { HTTP_STATUS } from '@/constants/http'
import { ROUTES } from '@/constants/routes'
import type { subscribeSchema } from '@/schemas/newsletter'
import type { AdminSubscriber } from '@/types/newsletter'

import { confirmLink, createConfirmToken, hashConfirmToken, linkCutoff, purgeCutoff } from '../confirmation'
import { prisma } from '../db'
import { HttpError } from '../errors'
import { log } from '../log'
import { assertDeliverable } from './contact'
import { sendNewsletterConfirmation } from '../mail/confirmMails'

/**
 * Prijava — aktivna tek posle potvrde linkom (ADR 0016). Odgovor je ISTI za novu, postojeću i
 * već potvrđenu adresu: forma ne otkriva ko je prijavljen. Ponovna prijava posle odjave traži
 * novu potvrdu; `createdAt` je trenutak poslednje prijave (rok linka i čišćenje računaju od njega).
 */
export const subscribe = async (input: z.output<typeof subscribeSchema>) => {
  if (input.website) return

  const email = (await assertDeliverable(input.email, input.allowTypo)).toLowerCase()
  await prisma.newsletterSubscriber.deleteMany({ where: { confirmedAt: null, createdAt: { lt: purgeCutoff() } } })

  const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } })
  if (existing?.confirmedAt && !existing.unsubscribedAt) return

  const { token, hash } = createConfirmToken()
  const pending = { locale: input.locale, confirmTokenHash: hash, confirmedAt: null, unsubscribedAt: null, createdAt: new Date() }
  await prisma.newsletterSubscriber.upsert({ where: { email }, create: { email, ...pending }, update: pending })

  try {
    await sendNewsletterConfirmation({ to: email, locale: input.locale, link: confirmLink(ROUTES.NEWSLETTER_CONFIRM, input.locale, token) })
  } catch (error) {
    log.error('mejl za potvrdu prijave nije poslat', error)
    throw new HttpError(HTTP_STATUS.SERVICE_UNAVAILABLE, 'newsletter.errors.mailFailed')
  }
}

/** Potvrda prijave (POST sa stranice potvrde). Uslov u istom UPDATE-u — dupli klik je bezopasan. */
export const confirmSubscription = async (token: string): Promise<ConfirmStatus> => {
  const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { confirmTokenHash: hashConfirmToken(token) } })
  if (!subscriber) return 'invalid'
  if (subscriber.confirmedAt) return 'confirmed'
  if (subscriber.createdAt < linkCutoff()) return 'expired'
  await prisma.newsletterSubscriber.updateMany({ where: { id: subscriber.id, confirmedAt: null }, data: { confirmedAt: new Date() } })
  return 'confirmed'
}

/** Za stranicu potvrde (GET) — bez izmene. */
export const subscriptionStatus = async (token: string): Promise<'pending' | ConfirmStatus> => {
  const subscriber = await prisma.newsletterSubscriber.findUnique({ where: { confirmTokenHash: hashConfirmToken(token) } })
  if (!subscriber) return 'invalid'
  if (subscriber.confirmedAt) return 'confirmed'
  return subscriber.createdAt < linkCutoff() ? 'expired' : 'pending'
}

/** Odjava jednim klikom (link u mejlu nosi token, ne adresu). Nepoznat token nije greška. */
export const unsubscribe = async (token: string) => {
  await prisma.newsletterSubscriber.updateMany({
    where: { unsubscribeToken: token, unsubscribedAt: null },
    data: { unsubscribedAt: new Date() },
  })
}

export const listSubscribers = async (): Promise<AdminSubscriber[]> =>
  (await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: 'desc' } })).map((s) => ({
    id: s.id,
    email: s.email,
    locale: s.locale,
    createdAt: s.createdAt.toISOString(),
    confirmedAt: s.confirmedAt?.toISOString() ?? null,
    unsubscribedAt: s.unsubscribedAt?.toISOString() ?? null,
  }))

export const deleteSubscriber = async (id: string) => {
  await prisma.newsletterSubscriber.delete({ where: { id } })
}

const csvCell = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value)

/**
 * CSV aktivnih (potvrđenih, neodjavljenih) prijava. Ćelija koja počinje sa `=`, `+`, `-`, `@` dobija apostrof — inače je
 * Excel izvrši kao formulu (CSV injection).
 */
export const exportSubscribersCsv = async () => {
  const active = await prisma.newsletterSubscriber.findMany({
    where: { unsubscribedAt: null, confirmedAt: { not: null } },
    orderBy: { createdAt: 'asc' },
  })
  const neutralize = (value: string) => (/^[=+\-@]/.test(value) ? `'${value}` : value)
  const rows = active.map((s) =>
    [s.email, s.locale, s.createdAt.toISOString()].map((v) => csvCell(neutralize(v))).join(','),
  )
  return ['email,locale,created_at', ...rows].join('\n')
}
