import { beforeEach, describe, expect, it, vi } from 'vitest'

import { prisma } from '../db'
import type { EmailVerdict } from '../email-verification'

const verifyEmail = vi.fn<(email: string) => Promise<EmailVerdict>>()
vi.mock('../email-verification', () => ({ verifyEmail: (email: string) => verifyEmail(email) }))

const { exportSubscribersCsv, subscribe, unsubscribe } = await import('./newsletter')

beforeEach(() => {
  verifyEmail.mockImplementation((email: string) => Promise.resolve({ ok: true, email }))
})

const input = (email: string) => ({ email, locale: 'en' as const, allowTypo: false })

describe('newsletter', () => {
  it('ponovljena prijava je ista operacija (nema greške, nema duplikata)', async () => {
    await subscribe(input('Ana@Primer.rs'))
    await subscribe(input('ana@primer.rs'))
    expect(await prisma.newsletterSubscriber.count()).toBe(1)
  })

  it('odjavljena adresa se prijavom ponovo aktivira', async () => {
    await subscribe(input('ana@primer.rs'))
    const { unsubscribeToken } = await prisma.newsletterSubscriber.findFirstOrThrow()
    await unsubscribe(unsubscribeToken)
    await subscribe(input('ana@primer.rs'))

    expect((await prisma.newsletterSubscriber.findFirstOrThrow()).unsubscribedAt).toBeNull()
  })

  it('adresa bez MX-a se ne upisuje', async () => {
    verifyEmail.mockResolvedValue({ ok: false, reason: 'noMx', suggestion: null })
    await expect(subscribe(input('x@nepostoji-domen-123.xyz'))).rejects.toMatchObject({
      status: 422,
    })
    expect(await prisma.newsletterSubscriber.count()).toBe(0)
  })

  it('CSV neutralizuje ćelije koje bi Excel izvršio kao formulu', async () => {
    await prisma.newsletterSubscriber.create({ data: { email: '=cmd@primer.rs', locale: 'en' } })
    const csv = await exportSubscribersCsv()
    expect(csv).toContain("'=cmd@primer.rs")
  })
})
