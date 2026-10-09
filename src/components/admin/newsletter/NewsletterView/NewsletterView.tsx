'use client'

import { useTranslations } from 'next-intl'

import Badge from '@/components/admin/Badge'
import DataTable, { type DataColumn } from '@/components/admin/DataTable'
import PageHeader from '@/components/admin/PageHeader'
import Button from '@/components/buttons/Button'
import IconButton from '@/components/buttons/IconButton'
import { useSubscribers } from '@/hooks/admin/newsletter'

import { Email, Hint, Lang, Status } from './NewsletterView.styles'

type SubscriberRow = ReturnType<typeof useSubscribers>['items'][number]

const TONES = { confirmed: 'success', pending: 'neutral', unsubscribed: 'danger' } as const

/** `/admin/newsletter` — pretplatnici i CSV izvoz. */
const NewsletterView = () => {
  const t = useTranslations('admin')
  const subscribers = useSubscribers()

  const columns: DataColumn<SubscriberRow>[] = [
    { key: 'email', header: t('newsletter.email'), cell: (s) => <Email>{s.email}</Email> },
    { key: 'status', header: t('newsletter.status'), cell: (s) => <Badge tone={TONES[s.state]}>{t(`newsletter.${s.state}`)}</Badge> },
    { key: 'lang', header: t('newsletter.language'), wide: true, cell: (s) => <Lang>{s.locale}</Lang> },
    { key: 'date', header: t('newsletter.signedUp'), wide: true, cell: (s) => s.signedUp },
    {
      key: 'actions',
      header: t('common.actions'),
      align: 'right',
      cell: (s) => <IconButton icon="trash" label={`${t('common.delete')} ${s.email}`} onClick={() => void subscribers.remove(s)} />,
    },
  ]

  return (
    <>
      <PageHeader
        title={t('nav.newsletter')}
        lead={t('newsletter.lead', { confirmed: subscribers.confirmed, pending: subscribers.pending })}
        actions={
          <Button variant="secondary" iconLeft="download" loading={subscribers.isExporting} onClick={() => void subscribers.exportCsv()}>
            {t('newsletter.export')}
          </Button>
        }
      />
      {subscribers.isLoading || subscribers.isError ? (
        <Status role={subscribers.isError ? 'alert' : 'status'}>{t(subscribers.isError ? 'common.loadFailed' : 'common.loading')}</Status>
      ) : (
        <DataTable rows={subscribers.items} columns={columns} rowKey={(s) => s.id} empty={t('newsletter.empty')} caption={t('nav.newsletter')} />
      )}
      <Hint>{t('newsletter.exportHint')}</Hint>
    </>
  )
}

export default NewsletterView
