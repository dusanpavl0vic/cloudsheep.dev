import { INTL_LOCALES, type Locale } from '@/constants/i18n'
import type { BookingSlot } from '@/types/booking'

const TIME_ZONE = 'Europe/Belgrade'

export interface BookingDay {
  /** `2026-10-12` u vremenu studija. */
  key: string
  weekday: string
  date: string
  slots: { id: string; time: string; label: string }[]
}

const parts = (iso: string, locale: Locale, options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat(INTL_LOCALES[locale], { timeZone: TIME_ZONE, ...options }).format(new Date(iso))

/** Termini grupisani po danu u vremenu studija (CET/CEST), hronološki; najviše `maxDays` dana. */
export const groupSlotsByDay = (slots: readonly BookingSlot[], locale: Locale, maxDays: number): BookingDay[] => {
  const days = new Map<string, BookingDay>()
  for (const slot of [...slots].sort((a, b) => a.startsAt.localeCompare(b.startsAt))) {
    const key = new Intl.DateTimeFormat('en-CA', { timeZone: TIME_ZONE }).format(new Date(slot.startsAt))
    if (!days.has(key)) {
      if (days.size >= maxDays) break
      days.set(key, {
        key,
        weekday: parts(slot.startsAt, locale, { weekday: 'short' }),
        date: parts(slot.startsAt, locale, { day: 'numeric', month: 'numeric' }),
        slots: [],
      })
    }
    const time = parts(slot.startsAt, locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    days.get(key)?.slots.push({ id: slot.id, time, label: parts(slot.startsAt, locale, { dateStyle: 'full', timeStyle: 'short' }) })
  }
  return [...days.values()]
}
