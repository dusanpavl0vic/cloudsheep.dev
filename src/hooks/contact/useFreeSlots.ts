'use client'

import { useLocale } from 'next-intl'

import { groupSlotsByDay } from '@/helpers/booking'
import type { BookingSlot } from '@/types/booking'

/** Koliko dana sa terminima se prikazuje (dizajn: pet kolona). */
const VISIBLE_DAYS = 5

/**
 * Slobodni termini po danima u vremenu studija. Spisak čita stranica na serveru (dinamička je
 * ionako) — bez klijentskog fetch-a; posle zauzetog termina `router.refresh()` donosi nov spisak.
 */
export const useFreeSlots = (slots: readonly BookingSlot[]) => {
  const locale = useLocale()
  const all = groupSlotsByDay(slots, locale, Number.MAX_SAFE_INTEGER)

  return {
    days: all.slice(0, VISIBLE_DAYS),
    labelOf: (id: string | null) => (id ? (all.flatMap((day) => day.slots).find((slot) => slot.id === id)?.label ?? null) : null),
  }
}
