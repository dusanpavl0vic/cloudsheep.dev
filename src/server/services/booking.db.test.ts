import { describe, expect, it } from 'vitest'

import { prisma } from '../db'
import { deleteSlot, generateSlots, listFreeSlots } from './booking'

const DAY = 24 * 3600 * 1000

const isoDay = (offsetDays: number) =>
  new Date(Date.now() + offsetDays * DAY).toISOString().slice(0, 10)

describe('booking', () => {
  it('generator pravi termine samo za izabrane dane i preskače postojeće', async () => {
    const input = {
      from: isoDay(2),
      to: isoDay(8),
      weekdays: [1, 2, 3, 4, 5],
      times: ['10:00', '13:00'],
      durationMin: 30,
    }

    const first = await generateSlots(input)
    const second = await generateSlots(input)

    expect(first.created).toBeGreaterThan(0)
    expect(first.created % 2).toBe(0)
    expect(second.created).toBe(0)
  })

  it('slobodni termini: bez zauzetih, bez onih unutar 12 h i posle dve nedelje', async () => {
    const now = new Date()
    const message = await prisma.contactMessage.create({
      data: { name: 'A', email: 'a@b.rs', message: 'poruka' },
    })
    await prisma.bookingSlot.createMany({
      data: [
        { startsAt: new Date(now.getTime() + 2 * 3600 * 1000) }, // prerano
        { startsAt: new Date(now.getTime() + 2 * DAY) }, // slobodan
        { startsAt: new Date(now.getTime() + 3 * DAY), contactMessageId: message.id }, // zauzet
        { startsAt: new Date(now.getTime() + 20 * DAY) }, // predaleko
      ],
    })

    const free = await listFreeSlots(now)
    expect(free).toHaveLength(1)
    expect(new Date(free[0]?.startsAt ?? 0).getTime()).toBe(now.getTime() + 2 * DAY)
  })

  it('zauzet termin ne može da se obriše — prvo se oslobađa', async () => {
    const message = await prisma.contactMessage.create({
      data: { name: 'A', email: 'a@b.rs', message: 'poruka' },
    })
    const slot = await prisma.bookingSlot.create({
      data: { startsAt: new Date(Date.now() + 2 * DAY), contactMessageId: message.id },
    })

    await expect(deleteSlot(slot.id)).rejects.toMatchObject({ status: 409 })
  })

  it('brisanje poruke oslobađa njen termin', async () => {
    const message = await prisma.contactMessage.create({
      data: { name: 'A', email: 'a@b.rs', message: 'poruka' },
    })
    const slot = await prisma.bookingSlot.create({
      data: { startsAt: new Date(Date.now() + 2 * DAY), contactMessageId: message.id },
    })

    await prisma.contactMessage.delete({ where: { id: message.id } })
    expect(
      (await prisma.bookingSlot.findUniqueOrThrow({ where: { id: slot.id } })).contactMessageId,
    ).toBeNull()
  })
})
