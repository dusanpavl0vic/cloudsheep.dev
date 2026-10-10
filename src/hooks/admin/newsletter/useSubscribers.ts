'use client'

import { useLocale, useTranslations } from 'next-intl'

import { formatDate } from '@/helpers/date'
import { saveBlob } from '@/helpers/download'
import { useDeleteSubscriberMutation, useExportSubscribersMutation, useGetSubscribersQuery } from '@/store/api/admin/newsletter'
import type { AdminSubscriber } from '@/types/newsletter'

import { useAdminAction } from '../useAdminAction'

export type SubscriberState = 'confirmed' | 'pending' | 'unsubscribed'

const stateOf = (subscriber: AdminSubscriber): SubscriberState => {
  if (subscriber.unsubscribedAt) return 'unsubscribed'
  return subscriber.confirmedAt ? 'confirmed' : 'pending'
}

const CSV_FILENAME = 'newsletter.csv'

/** Pretplatnici newslettera: lista sa statusom potvrde, brisanje i CSV izvoz (samo potvrđeni). */
export const useSubscribers = () => {
  const t = useTranslations('admin.newsletter')
  const locale = useLocale()
  const query = useGetSubscribersQuery(undefined)
  const [deleteSubscriber] = useDeleteSubscriberMutation()
  const [exportCsv, { isLoading: isExporting }] = useExportSubscribersMutation()
  const { run, remove } = useAdminAction()
  const items = (query.data ?? []).map((s) => ({ ...s, state: stateOf(s), signedUp: formatDate(s.createdAt, locale) }))

  return {
    items,
    confirmed: items.filter((s) => s.state === 'confirmed').length,
    pending: items.filter((s) => s.state === 'pending').length,
    isLoading: query.isLoading,
    isError: query.isError,
    isExporting,
    exportCsv: async () => {
      const csv = await run(() => exportCsv(undefined).unwrap())
      if (csv !== undefined) saveBlob(csv, CSV_FILENAME)
    },
    remove: (subscriber: AdminSubscriber) =>
      remove(t('deleteConfirm', { email: subscriber.email }), () => deleteSubscriber(subscriber.id).unwrap()),
  }
}
