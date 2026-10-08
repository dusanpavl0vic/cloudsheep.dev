import 'server-only'

import type { z } from 'zod'

import type { subscribeSchema } from '@/schemas/newsletter'
import type { AdminSubscriber } from '@/types/newsletter'

import { prisma } from '../db'
import { assertDeliverable } from './contact'

/**
 * Prijava. Odgovor je ISTI za novu i postojeću adresu — inače bi forma otkrivala ko je već
 * prijavljen. Odjavljena adresa se ponovo aktivira.
 */
export const subscribe = async (input: z.output<typeof subscribeSchema>) => {
  if (input.website) return

  const email = (await assertDeliverable(input.email, input.allowTypo)).toLowerCase()
  await prisma.newsletterSubscriber.upsert({
    where: { email },
    create: { email, locale: input.locale },
    update: { unsubscribedAt: null, locale: input.locale },
  })
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
    unsubscribedAt: s.unsubscribedAt?.toISOString() ?? null,
  }))

export const deleteSubscriber = async (id: string) => {
  await prisma.newsletterSubscriber.delete({ where: { id } })
}

const csvCell = (value: string) => (/[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value)

/**
 * CSV aktivnih prijava. Ćelija koja počinje sa `=`, `+`, `-`, `@` dobija apostrof — inače je
 * Excel izvrši kao formulu (CSV injection).
 */
export const exportSubscribersCsv = async () => {
  const active = await prisma.newsletterSubscriber.findMany({
    where: { unsubscribedAt: null },
    orderBy: { createdAt: 'asc' },
  })
  const neutralize = (value: string) => (/^[=+\-@]/.test(value) ? `'${value}` : value)
  const rows = active.map((s) =>
    [s.email, s.locale, s.createdAt.toISOString()].map((v) => csvCell(neutralize(v))).join(','),
  )
  return ['email,locale,created_at', ...rows].join('\n')
}
