'use client'

import { useTranslations } from 'next-intl'

import Badge from '@/components/admin/Badge'
import DataTable, { type DataColumn } from '@/components/admin/DataTable'
import PageHeader from '@/components/admin/PageHeader'
import Button from '@/components/buttons/Button'
import { useSlots } from '@/hooks/admin/booking'

import SlotGenerator from '../SlotGenerator'
import { Client, Layout, RowActions, Status, When } from './BookingView.styles'

type SlotRow = ReturnType<typeof useSlots>['slots'][number]

const TONES = { free: 'success', booked: 'accent', pending: 'neutral', past: 'neutral' } as const

/** `/admin/booking` — termini za uvodni poziv i generator. */
const BookingView = () => {
  const t = useTranslations('admin')
  const slots = useSlots()

  const columns: DataColumn<SlotRow>[] = [
    { key: 'time', header: t('booking.time'), cell: (slot) => <When>{slot.label}</When> },
    { key: 'status', header: t('booking.status'), cell: (slot) => <Badge tone={TONES[slot.state]}>{t(`booking.${slot.state}`)}</Badge> },
    {
      key: 'client',
      header: t('booking.client'),
      wide: true,
      cell: (slot) =>
        slot.booking ? (
          <Client>
            {slot.booking.name}
            <small>{slot.booking.email}</small>
          </Client>
        ) : (
          t('common.none')
        ),
    },
    {
      key: 'actions',
      header: t('common.actions'),
      align: 'right',
      cell: (slot) =>
        slot.state === 'past' ? null : (
          <RowActions>
            {slot.booking ? (
              <Button variant="secondary" size="s" onClick={() => void slots.release(slot)}>
                {t('booking.release')}
              </Button>
            ) : (
              <Button variant="ghost" size="s" iconLeft="trash" onClick={() => void slots.remove(slot)}>
                {t('common.delete')}
              </Button>
            )}
          </RowActions>
        ),
    },
  ]

  return (
    <>
      <PageHeader title={t('nav.booking')} lead={t('booking.lead')} />
      <Layout>
        {slots.isLoading || slots.isError ? (
          <Status role={slots.isError ? 'alert' : 'status'}>{t(slots.isError ? 'common.loadFailed' : 'common.loading')}</Status>
        ) : (
          <DataTable rows={slots.slots} columns={columns} rowKey={(slot) => slot.id} empty={t('booking.empty')} caption={t('booking.upcoming')} />
        )}
        <SlotGenerator />
      </Layout>
    </>
  )
}

export default BookingView
