'use client'

import { useLocale, useTranslations } from 'next-intl'

import { formatDate } from '@/helpers/date'
import { useDeleteSlotMutation, useGetSlotsQuery, useReleaseSlotMutation } from '@/store/api/admin/booking'
import type { AdminBookingSlot } from '@/types/booking'

import { useAdminAction } from '../useAdminAction'

const SLOT_FORMAT = { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' } as const

export type SlotState = 'free' | 'booked' | 'pending' | 'past'

/** Stanje termina za prikaz: prošao, slobodan, zauzet potvrđenim upitom ili čeka potvrdu. */
const stateOf = (slot: AdminBookingSlot, now: number): SlotState => {
  if (new Date(slot.startsAt).getTime() < now) return 'past'
  if (!slot.booking) return 'free'
  return slot.booking.confirmed ? 'booked' : 'pending'
}

/** Termini za uvodni poziv (od pre nedelju dana nadalje), sa oslobađanjem i brisanjem. */
export const useSlots = () => {
  const t = useTranslations('admin.booking')
  const locale = useLocale()
  const query = useGetSlotsQuery(undefined)
  const [release] = useReleaseSlotMutation()
  const [deleteSlot] = useDeleteSlotMutation()
  const { run, remove, confirm } = useAdminAction()
  const now = query.fulfilledTimeStamp ?? 0

  return {
    slots: (query.data ?? []).map((slot) => ({ ...slot, label: formatDate(slot.startsAt, locale, SLOT_FORMAT), state: stateOf(slot, now) })),
    isLoading: query.isLoading,
    isError: query.isError,
    release: async (slot: AdminBookingSlot) => {
      if (slot.booking && (await confirm({ message: t('releaseConfirm', { name: slot.booking.name }) }))) {
        await run(() => release(slot.id).unwrap(), 'saved')
      }
    },
    remove: (slot: AdminBookingSlot) =>
      remove(t('deleteConfirm', { time: formatDate(slot.startsAt, locale, SLOT_FORMAT) }), () => deleteSlot(slot.id).unwrap()),
  }
}
