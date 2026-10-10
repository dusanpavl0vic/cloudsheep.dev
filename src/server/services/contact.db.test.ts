import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Brief } from '@/schemas/contact'

import { prisma } from '../db'
import type { EmailVerdict } from '../email-verification'
import { HttpError } from '../http'
import type { BriefMail } from '../mail/briefMails'

const verifyEmail = vi.fn<(email: string) => Promise<EmailVerdict>>()
const sendStudioMail = vi.fn<(mail: BriefMail) => Promise<void>>()
const sendAutoReply = vi.fn<(mail: BriefMail) => Promise<void>>()
const sendBriefConfirmation = vi.fn<(mail: { to: string; link: string }) => Promise<void>>()

vi.mock('../email-verification', () => ({ verifyEmail: (email: string) => verifyEmail(email) }))
vi.mock('../mail/briefMails', () => ({
  sendStudioMail: (mail: BriefMail) => sendStudioMail(mail),
  sendAutoReply: (mail: BriefMail) => sendAutoReply(mail),
}))
vi.mock('../mail/confirmMails', () => ({
  sendBriefConfirmation: (mail: { to: string; link: string }) => sendBriefConfirmation(mail),
}))

const { confirmBrief, getBriefForConfirmation, listMessages, submitBrief } = await import('./contact')

/** Token iz linka poslednjeg mejla za potvrdu. */
const lastToken = () => new URL(sendBriefConfirmation.mock.calls.at(-1)?.[0].link ?? '').searchParams.get('token') ?? ''

const HOUR = 3_600_000
const age = (id: string, hours: number) =>
  prisma.contactMessage.update({ where: { id }, data: { createdAt: new Date(Date.now() - hours * HOUR) } })

const brief = (overrides: Partial<Brief> = {}): Brief => ({
  projectType: 'webapp',
  budget: '5to15k',
  timeline: '1to3',
  name: 'Marko Marković',
  email: 'marko@primer.rs',
  message: 'Zdravo, zanima me saradnja na web aplikaciji.',
  slotId: null,
  estimate: null,
  locale: 'sr',
  allowTypo: false,
  ...overrides,
})

const meta = { ip: '127.0.0.1', userAgent: 'test' }

const futureSlot = () =>
  prisma.bookingSlot.create({ data: { startsAt: new Date(Date.now() + 3 * 24 * 3600 * 1000) } })

beforeEach(() => {
  verifyEmail.mockImplementation((email: string) => Promise.resolve({ ok: true, email }))
  sendStudioMail.mockResolvedValue(undefined)
  sendAutoReply.mockResolvedValue(undefined)
  sendBriefConfirmation.mockResolvedValue(undefined)
})

describe('submitBrief — upit čeka potvrdu adrese (ADR 0016)', () => {
  it('upisuje NEPOTVRĐEN upit i šalje samo link za potvrdu — studio ne dobija ništa', async () => {
    await submitBrief(brief(), meta)

    const [message] = await prisma.contactMessage.findMany()
    expect(message).toMatchObject({ email: 'marko@primer.rs', projectType: 'webapp', confirmedAt: null })
    expect(message?.confirmTokenHash).toMatch(/^[0-9a-f]{64}$/)
    expect(sendBriefConfirmation).toHaveBeenCalledOnce()
    expect(sendBriefConfirmation.mock.calls[0]?.[0].link).toMatch(/\/sr\/contact\/confirm\?token=/)
    expect(sendStudioMail).not.toHaveBeenCalled()
    // Token se ne čuva — samo heš.
    expect(message?.confirmTokenHash).not.toBe(lastToken())
  })

  it('adresa koja ne prima poštu: 422 na polju email, BEZ upisa i slanja', async () => {
    verifyEmail.mockResolvedValue({ ok: false, reason: 'noMx', suggestion: null })

    const error = await submitBrief(brief({ email: 'x@nepostoji-domen-123.xyz' }), meta).catch((e: unknown) => e)
    expect(error).toBeInstanceOf(HttpError)
    expect(error).toMatchObject({ status: 422, messageKey: 'email.errors.noMx', details: { field: 'email' } })
    expect(await prisma.contactMessage.count()).toBe(0)
    expect(sendBriefConfirmation).not.toHaveBeenCalled()
  })

  it('greška u kucanju vraća predlog ispravke', async () => {
    verifyEmail.mockResolvedValue({ ok: false, reason: 'typo', suggestion: 'marko@gmail.com' })
    await expect(submitBrief(brief({ email: 'marko@gmial.com' }), meta)).rejects.toMatchObject({
      messageKey: 'email.errors.typo',
      details: { field: 'email', suggestion: 'marko@gmail.com' },
    })
  })

  it('honeypot: tiho ništa — nema upisa ni mejla', async () => {
    await submitBrief(brief({ website: 'http://spam.example' }), meta)
    expect(await prisma.contactMessage.count()).toBe(0)
    expect(verifyEmail).not.toHaveBeenCalled()
  })

  it('mejl za potvrdu ne može da ode: 503, upit se briše i termin oslobađa', async () => {
    sendBriefConfirmation.mockRejectedValue(new Error('535 auth failed'))
    const slot = await futureSlot()

    await expect(submitBrief(brief({ slotId: slot.id }), meta)).rejects.toMatchObject({ status: 503, messageKey: 'contact.errors.mailFailed' })
    expect(await prisma.contactMessage.count()).toBe(0)
    expect((await prisma.bookingSlot.findUniqueOrThrow({ where: { id: slot.id } })).contactMessageId).toBeNull()
  })

  it('nepotvrđeni upiti stariji od 7 dana se brišu pri sledećem upitu', async () => {
    await submitBrief(brief(), meta)
    const [old] = await prisma.contactMessage.findMany()
    await age(old?.id ?? '', 8 * 24)
    await submitBrief(brief({ email: 'novi@primer.rs' }), meta)

    expect((await prisma.contactMessage.findMany()).map((m) => m.email)).toEqual(['novi@primer.rs'])
  })
})

describe('termini', () => {
  it('upit drži izabran termin dok čeka potvrdu', async () => {
    const slot = await futureSlot()
    await submitBrief(brief({ slotId: slot.id }), meta)
    expect((await prisma.bookingSlot.findUniqueOrThrow({ where: { id: slot.id } })).contactMessageId).not.toBeNull()
  })

  it('dva ISTOVREMENA upita za isti termin: tačno jedan uspeva, drugi ne ostavlja poruku', async () => {
    const slot = await futureSlot()
    const results = await Promise.allSettled([
      submitBrief(brief({ slotId: slot.id, email: 'prvi@primer.rs' }), meta),
      submitBrief(brief({ slotId: slot.id, email: 'drugi@primer.rs' }), meta),
    ])

    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1)
    expect(results.find((r) => r.status === 'rejected')?.reason).toMatchObject({ status: 409, messageKey: 'contact.errors.slotTaken' })
    expect(await prisma.contactMessage.count()).toBe(1)
  })

  it('termin nepotvrđenog upita starijeg od 24 h je ponovo slobodan', async () => {
    const slot = await futureSlot()
    await submitBrief(brief({ slotId: slot.id, email: 'prvi@primer.rs' }), meta)
    const [first] = await prisma.contactMessage.findMany()
    await age(first?.id ?? '', 25)

    await submitBrief(brief({ slotId: slot.id, email: 'drugi@primer.rs' }), meta)
    const owner = await prisma.bookingSlot.findUniqueOrThrow({ where: { id: slot.id }, include: { contactMessage: true } })
    expect(owner.contactMessage?.email).toBe('drugi@primer.rs')
  })

  it('termin unutar minimalnog razmaka (12 h) ne može da se zauzme', async () => {
    const soon = await prisma.bookingSlot.create({ data: { startsAt: new Date(Date.now() + HOUR) } })
    await expect(submitBrief(brief({ slotId: soon.id }), meta)).rejects.toMatchObject({ status: 409 })
  })
})

describe('confirmBrief', () => {
  it('potvrda: upit postaje vidljiv, studio i posetilac dobijaju mejl; dupli klik ništa ne šalje', async () => {
    const slot = await futureSlot()
    await submitBrief(brief({ slotId: slot.id }), meta)
    const token = lastToken()

    expect(await getBriefForConfirmation(token)).toMatchObject({ status: 'pending', name: 'Marko Marković' })
    expect(await confirmBrief(token)).toEqual({ status: 'confirmed', locale: 'sr' })
    expect(await confirmBrief(token)).toEqual({ status: 'confirmed', locale: 'sr' })

    const [message] = await prisma.contactMessage.findMany()
    expect(message?.confirmedAt).not.toBeNull()
    expect(message?.emailSentAt).not.toBeNull()
    expect(sendStudioMail).toHaveBeenCalledOnce()
    expect(sendAutoReply).toHaveBeenCalledOnce()
    expect(sendAutoReply.mock.calls[0]?.[0]).toMatchObject({ callAt: slot.startsAt })
  })

  it('GET pregled ne potvrđuje ništa (skeneri pošte otvaraju linkove)', async () => {
    await submitBrief(brief(), meta)
    await getBriefForConfirmation(lastToken())
    expect((await prisma.contactMessage.findFirstOrThrow()).confirmedAt).toBeNull()
  })

  it('istekao link (> 24 h) se ne potvrđuje; nepoznat token je nevažeći', async () => {
    await submitBrief(brief(), meta)
    const token = lastToken()
    await age((await prisma.contactMessage.findFirstOrThrow()).id, 25)

    expect((await confirmBrief(token)).status).toBe('expired')
    expect((await confirmBrief('izmisljen-token')).status).toBe('invalid')
    expect(sendStudioMail).not.toHaveBeenCalled()
  })

  it('pad SMTP-a pri slanju studiju ne gubi potvrđen upit — greška se beleži', async () => {
    sendStudioMail.mockRejectedValue(new Error('535 auth failed'))
    await submitBrief(brief(), meta)
    await confirmBrief(lastToken())

    const [message] = await prisma.contactMessage.findMany()
    expect(message?.confirmedAt).not.toBeNull()
    expect(message?.emailError).toBe('535 auth failed')
  })

  it('pad kopije posetiocu ne poništava zapis o mejlu studiju', async () => {
    sendAutoReply.mockRejectedValue(new Error('mailbox full'))
    await submitBrief(brief(), meta)
    await confirmBrief(lastToken())
    expect((await prisma.contactMessage.findFirstOrThrow()).emailSentAt).not.toBeNull()
  })

  it('admin vidi samo potvrđene upite', async () => {
    await submitBrief(brief({ email: 'ceka@primer.rs' }), meta)
    await submitBrief(brief({ email: 'potvrdio@primer.rs' }), meta)
    await confirmBrief(lastToken())

    const { items, unread } = await listMessages('all')
    expect(items.map((m) => m.email)).toEqual(['potvrdio@primer.rs'])
    expect(unread).toBe(1)
  })
})
