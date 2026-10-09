'use client'

import { useLocale } from 'next-intl'

import { groupSlotsByDay } from '@/helpers/booking'
import { useGetFreeSlotsQuery } from '@/store/api/booking'

/** Koliko dana sa terminima se prikazuje (dizajn: pet kolona). */
const VISIBLE_DAYS = 5

/** Slobodni termini uvodnog poziva, po danima u vremenu studija. */
export const useFreeSlots = () => {
  const locale = useLocale()
  const { data, isLoading, isError, refetch } = useGetFreeSlotsQuery(undefined)
  const slots = data ?? []

  return {
    days: groupSlotsByDay(slots, locale, VISIBLE_DAYS),
    labelOf: (id: string | null) => (id ? groupSlotsByDay(slots, locale, Number.MAX_SAFE_INTEGER).flatMap((day) => day.slots).find((slot) => slot.id === id)?.label ?? null : null),
    isLoading,
    isError,
    refetch,
  }
}
