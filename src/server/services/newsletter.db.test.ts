import { beforeEach, describe, expect, it, vi } from 'vitest'

import { prisma } from '../db'
import type { EmailVerdict } from '../email-verification'

const verifyEmail = vi.fn<(email: string) => Promise<EmailVerdict>>()
const sendNewsletterConfirmation = vi.fn<(mail: { to: string; link: string }) => Promise<void>>()
vi.mock('../email-verification', () => ({ verifyEmail: (email: string) => verifyEmail(email) }))
vi.mock('../mail/confirmMails', () => ({
  sendNewsletterConfirmation: (mail: { to: string; link: string }) => sendNewsletterConfirmation(mail),
}))

const { confirmSubscription, exportSubscribersCsv, subscribe, subscriptionStatus, unsubscribe } = await import('./newsletter')

const lastToken = () => new URL(sendNewsletterConfirmation.mock.calls.at(-1)?.[0].link ?? '').searchParams.get('token') ?? ''

beforeEach(() => {
  verifyEmail.mockImplementation((email: string) => Promise.resolve({ ok: true, email }))
  sendNewsletterConfirmation.mockResolvedValue(undefined)
})

const input = (email: string) => ({ email, locale: 'en' as const, allowTypo: false })

describe('newsletter', () => {
  it('ponovljena prijava je ista operacija (nema greške, nema duplikata)', async () => {
    await subscribe(input('Ana@Primer.rs'))
    await subscribe(input('ana@primer.rs'))
    expect(await prisma.newsletterSubscriber.count()).toBe(1)
  })

  it('prijava je aktivna tek posle potvrde linkom (ADR 0016)', async () => {
    await subscribe(input('ana@primer.rs'))
    const token = lastToken()
    expect((await prisma.newsletterSubscriber.findFirstOrThrow()).confirmedAt).toBeNull()
    expect(await subscriptionStatus(token)).toBe('pending')
    expect(await exportSubscribersCsv()).not.toContain('ana@primer.rs')

    expect(await confirmSubscription(token)).toBe('confirmed')
    expect(await exportSubscribersCsv()).toContain('ana@primer.rs')
  })

  it('već potvrđena adresa ne dobija nov mejl — odgovor je isti (ne otkriva ko je prijavljen)', async () => {
    await subscribe(input('ana@primer.rs'))
    await confirmSubscription(lastToken())
    await subscribe(input('ana@primer.rs'))
    expect(sendNewsletterConfirmation).toHaveBeenCalledOnce()
  })

  it('posle odjave ponovna prijava traži novu potvrdu', async () => {
    await subscribe(input('ana@primer.rs'))
    await confirmSubscription(lastToken())
    const { unsubscribeToken } = await prisma.newsletterSubscriber.findFirstOrThrow()
    await unsubscribe(unsubscribeToken)
    await subscribe(input('ana@primer.rs'))

    const row = await prisma.newsletterSubscriber.findFirstOrThrow()
    expect(row.unsubscribedAt).toBeNull()
    expect(row.confirmedAt).toBeNull()
    expect(sendNewsletterConfirmation).toHaveBeenCalledTimes(2)
  })

  it('mejl za potvrdu ne može da ode: 503', async () => {
    sendNewsletterConfirmation.mockRejectedValue(new Error('535'))
    await expect(subscribe(input('ana@primer.rs'))).rejects.toMatchObject({ status: 503, messageKey: 'newsletter.errors.mailFailed' })
  })

  it('adresa bez MX-a se ne upisuje', async () => {
    verifyEmail.mockResolvedValue({ ok: false, reason: 'noMx', suggestion: null })
    await expect(subscribe(input('x@nepostoji-domen-123.xyz'))).rejects.toMatchObject({
      status: 422,
    })
    expect(await prisma.newsletterSubscriber.count()).toBe(0)
  })

  it('CSV neutralizuje ćelije koje bi Excel izvršio kao formulu', async () => {
    await prisma.newsletterSubscriber.create({ data: { email: '=cmd@primer.rs', locale: 'en', confirmedAt: new Date() } })
    const csv = await exportSubscribersCsv()
    expect(csv).toContain("'=cmd@primer.rs")
  })
})
