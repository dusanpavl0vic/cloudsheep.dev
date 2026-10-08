import { beforeEach, describe, expect, it, vi } from 'vitest'

import type { Brief } from '@/schemas/contact'

import { prisma } from '../db'
import type { EmailVerdict } from '../email-verification'
import { HttpError } from '../http'
import type { BriefMail } from '../mail/briefMails'

const verifyEmail = vi.fn<(email: string) => Promise<EmailVerdict>>()
const sendStudioMail = vi.fn<(mail: BriefMail) => Promise<void>>()
const sendAutoReply = vi.fn<(mail: BriefMail) => Promise<void>>()

vi.mock('../email-verification', () => ({ verifyEmail: (email: string) => verifyEmail(email) }))
vi.mock('../mail/briefMails', () => ({
  sendStudioMail: (mail: BriefMail) => sendStudioMail(mail),
  sendAutoReply: (mail: BriefMail) => sendAutoReply(mail),
}))

const { submitBrief } = await import('./contact')

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
})

describe('submitBrief', () => {
  it('upisuje upit i šalje oba mejla', async () => {
    await submitBrief(brief(), meta)

    const [message] = await prisma.contactMessage.findMany()
    expect(message).toMatchObject({
      email: 'marko@primer.rs',
      projectType: 'webapp',
      budget: '5to15k',
      locale: 'sr',
    })
    expect(message?.emailSentAt).not.toBeNull()
    expect(sendStudioMail).toHaveBeenCalledOnce()
    expect(sendAutoReply).toHaveBeenCalledOnce()
  })

  it('adresa koja ne prima poštu: 422 na polju email, BEZ upisa i slanja', async () => {
    verifyEmail.mockResolvedValue({ ok: false, reason: 'noMx', suggestion: null })

    const error = await submitBrief(brief({ email: 'x@nepostoji-domen-123.xyz' }), meta).catch(
      (e: unknown) => e,
    )
    expect(error).toBeInstanceOf(HttpError)
    expect(error).toMatchObject({
      status: 422,
      messageKey: 'email.errors.noMx',
      details: { field: 'email' },
    })
    expect(await prisma.contactMessage.count()).toBe(0)
    expect(sendStudioMail).not.toHaveBeenCalled()
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

  it('zauzima izabran termin', async () => {
    const slot = await futureSlot()
    await submitBrief(brief({ slotId: slot.id }), meta)

    const booked = await prisma.bookingSlot.findUniqueOrThrow({ where: { id: slot.id } })
    expect(booked.contactMessageId).not.toBeNull()
    expect(sendAutoReply.mock.calls[0]?.[0]).toMatchObject({ callAt: slot.startsAt })
  })

  it('dva ISTOVREMENA upita za isti termin: tačno jedan uspeva, drugi ne ostavlja poruku', async () => {
    const slot = await futureSlot()

    const results = await Promise.allSettled([
      submitBrief(brief({ slotId: slot.id, email: 'prvi@primer.rs' }), meta),
      submitBrief(brief({ slotId: slot.id, email: 'drugi@primer.rs' }), meta),
    ])

    expect(results.filter((r) => r.status === 'fulfilled')).toHaveLength(1)
    const rejected = results.find((r) => r.status === 'rejected')
    expect(rejected?.reason).toMatchObject({ status: 409, messageKey: 'contact.errors.slotTaken' })
    expect(await prisma.contactMessage.count()).toBe(1)
  })

  it('termin unutar minimalnog razmaka (12 h) ne može da se zauzme', async () => {
    const soon = await prisma.bookingSlot.create({
      data: { startsAt: new Date(Date.now() + 60 * 60 * 1000) },
    })
    await expect(submitBrief(brief({ slotId: soon.id }), meta)).rejects.toMatchObject({
      status: 409,
    })
  })

  it('pad SMTP-a ne gubi upit — greška se beleži na zapisu', async () => {
    sendStudioMail.mockRejectedValue(new Error('535 auth failed'))
    await submitBrief(brief(), meta)

    const [message] = await prisma.contactMessage.findMany()
    expect(message?.emailSentAt).toBeNull()
    expect(message?.emailError).toBe('535 auth failed')
  })

  it('pad potvrde posetiocu ne poništava zapis o mejlu studiju', async () => {
    sendAutoReply.mockRejectedValue(new Error('mailbox full'))
    await submitBrief(brief(), meta)

    const [message] = await prisma.contactMessage.findMany()
    expect(message?.emailSentAt).not.toBeNull()
  })
})
