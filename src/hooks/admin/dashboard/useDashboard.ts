'use client'

import { useLocale } from 'next-intl'

import { ROUTES } from '@/constants/routes'
import { formatDate } from '@/helpers/date'
import { useGetSlotsQuery } from '@/store/api/admin/booking'
import { useGetMessagesQuery } from '@/store/api/admin/messages'
import { useGetSubscribersQuery } from '@/store/api/admin/newsletter'
import { useGetNotesQuery } from '@/store/api/admin/notes'
import { useGetProjectsQuery } from '@/store/api/admin/projects'

const NEXT_CALLS = 5
const CALL_FORMAT = { weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' } as const

/**
 * Pregled: brojke iz istih upita kao stranice (keš se deli, pa prelazak na stranicu ne čeka).
 * `null` — podatak još stiže.
 */
export const useDashboard = () => {
  const locale = useLocale()
  const messages = useGetMessagesQuery('unread')
  const slots = useGetSlotsQuery(undefined)
  const subscribers = useGetSubscribersQuery(undefined)
  const projects = useGetProjectsQuery(undefined)
  const notes = useGetNotesQuery(undefined)
  const now = slots.fulfilledTimeStamp ?? 0
  const upcoming = (slots.data ?? []).filter((slot) => new Date(slot.startsAt).getTime() > now)
  const booked = upcoming.filter((slot) => slot.booking?.confirmed)
  const count = <T,>(data: T[] | undefined, keep: (item: T) => boolean = () => true) => (data ? data.filter(keep).length : null)

  return {
    stats: [
      { key: 'unread', value: messages.data?.unread ?? null, href: `${ROUTES.ADMIN_MESSAGES}?status=unread`, alert: false },
      { key: 'calls', value: slots.data ? booked.length : null, href: ROUTES.ADMIN_BOOKING, alert: false },
      { key: 'free', value: count(slots.data && upcoming, (slot) => !slot.booking), href: ROUTES.ADMIN_BOOKING, alert: slots.isSuccess && upcoming.every((slot) => slot.booking) },
      { key: 'subscribers', value: count(subscribers.data, (s) => Boolean(s.confirmedAt) && !s.unsubscribedAt), href: ROUTES.ADMIN_NEWSLETTER, alert: false },
      { key: 'projects', value: count(projects.data, (p) => p.isPublished), href: ROUTES.ADMIN_PROJECTS, alert: false },
      { key: 'notes', value: count(notes.data, (n) => n.isPublished), href: ROUTES.ADMIN_NOTES, alert: false },
    ] as const,
    nextCalls: booked.slice(0, NEXT_CALLS).map((slot) => ({
      id: slot.id,
      time: formatDate(slot.startsAt, locale, CALL_FORMAT),
      name: slot.booking?.name ?? '',
      email: slot.booking?.email ?? '',
    })),
  }
}
