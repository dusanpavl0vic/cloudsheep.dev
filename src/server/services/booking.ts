import 'server-only'

import type { z } from 'zod'

import {
  BOOKING_DAYS_AHEAD,
  BOOKING_GENERATE_MAX,
  BOOKING_MIN_LEAD_HOURS,
  BOOKING_TIME_ZONE,
} from '@/constants/booking'
import { HTTP_STATUS } from '@/constants/http'
import { daysBetween, isoWeekday, zonedTimeToUtc } from '@/helpers/date'
import type { generateSlotsSchema } from '@/schemas/booking'
import type { AdminBookingSlot, BookingSlot } from '@/types/booking'

import { prisma } from '../db'
import { HttpError } from '../http'

const HOUR = 60 * 60 * 1000

/** Najraniji termin koji još može da se zauzme. */
export const earliestBookable = (now = new Date()) =>
  new Date(now.getTime() + BOOKING_MIN_LEAD_HOURS * HOUR)

/**
 * Slobodni termini za narednih dve nedelje. NE kešira se: lista se menja sa svakim upitom, a
 * upit je jedan red u indeksu (`startsAt`).
 */
export const listFreeSlots = async (now = new Date()): Promise<BookingSlot[]> => {
  const slots = await prisma.bookingSlot.findMany({
    where: {
      contactMessageId: null,
      startsAt: {
        gt: earliestBookable(now),
        lt: new Date(now.getTime() + BOOKING_DAYS_AHEAD * 24 * HOUR),
      },
    },
    orderBy: { startsAt: 'asc' },
  })
  return slots.map((s) => ({
    id: s.id,
    startsAt: s.startsAt.toISOString(),
    durationMin: s.durationMin,
  }))
}

// ─── Admin ────────────────────────────────────────────────────────────────────────

/** Termini od pre nedelju dana nadalje, sa upitom koji ih je zauzeo. */
export const listAdminSlots = async (now = new Date()): Promise<AdminBookingSlot[]> => {
  const slots = await prisma.bookingSlot.findMany({
    where: { startsAt: { gt: new Date(now.getTime() - 7 * 24 * HOUR) } },
    orderBy: { startsAt: 'asc' },
    include: { contactMessage: { select: { id: true, name: true, email: true } } },
  })
  return slots.map((s) => ({
    id: s.id,
    startsAt: s.startsAt.toISOString(),
    durationMin: s.durationMin,
    booking: s.contactMessage
      ? {
          messageId: s.contactMessage.id,
          name: s.contactMessage.name,
          email: s.contactMessage.email,
        }
      : null,
  }))
}

/**
 * Pravi termine iz kombinacije dana i satnica (u vremenu studija). Termin koji već postoji se
 * preskače (`skipDuplicates` nad jedinstvenim `startsAt`); vraća broj NOVIH termina.
 */
export const generateSlots = async (input: z.output<typeof generateSlotsSchema>) => {
  const starts = daysBetween(input.from, input.to)
    .filter((day) => input.weekdays.includes(isoWeekday(day)))
    .flatMap((day) => input.times.map((time) => zonedTimeToUtc(day, time, BOOKING_TIME_ZONE)))
    .filter((startsAt) => startsAt > new Date())

  if (starts.length > BOOKING_GENERATE_MAX) {
    throw new HttpError(HTTP_STATUS.BAD_REQUEST, 'booking.errors.tooMany', { field: 'to' })
  }

  const { count } = await prisma.bookingSlot.createMany({
    data: starts.map((startsAt) => ({ startsAt, durationMin: input.durationMin })),
    skipDuplicates: true,
  })
  return { created: count }
}

/** Briše SAMO slobodan termin — zauzet se prvo oslobađa, da posetilac ne izgubi poziv tiho. */
export const deleteSlot = async (id: string) => {
  const { count } = await prisma.bookingSlot.deleteMany({ where: { id, contactMessageId: null } })
  if (count === 0) throw new HttpError(HTTP_STATUS.CONFLICT, 'booking.errors.booked')
}

export const releaseSlot = async (id: string) => {
  await prisma.bookingSlot.update({ where: { id }, data: { contactMessageId: null } })
}
