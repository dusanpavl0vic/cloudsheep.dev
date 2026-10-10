'use client'

import { useLocale, useTranslations } from 'next-intl'

import Badge from '@/components/admin/Badge'
import DataTable, { type DataColumn } from '@/components/admin/DataTable'
import ListStatus from '@/components/admin/ListStatus'
import OrderButtons from '@/components/admin/OrderButtons'
import PageHeader from '@/components/admin/PageHeader'
import RowActions from '@/components/admin/RowActions'
import Button from '@/components/buttons/Button'
import { useTestimonials } from '@/hooks/admin/testimonials'
import type { AdminTestimonial } from '@/types/testimonial'

import { Author, Quote } from './TestimonialsView.styles'

/** `/admin/testimonials` — utisci klijenata; objava jednim klikom na status. */
const TestimonialsView = () => {
  const t = useTranslations('admin')
  const locale = useLocale()
  const list = useTestimonials()

  const columns: DataColumn<AdminTestimonial>[] = [
    {
      key: 'order',
      header: '#',
      cell: (item) => {
        const index = list.items.indexOf(item)
        return (
          <OrderButtons
            name={item.authorName}
            canUp={list.order.canMove(index, -1)}
            canDown={list.order.canMove(index, 1)}
            onMove={(delta) => {
              list.order.move(index, delta)
            }}
          />
        )
      },
    },
    {
      key: 'author',
      header: t('testimonials.author'),
      cell: (item) => (
        <Author>
          {item.authorName}
          <small>{[locale === 'sr' ? item.authorRoleSr : item.authorRoleEn, item.company].filter(Boolean).join(' · ')}</small>
        </Author>
      ),
    },
    { key: 'quote', header: t('testimonials.quoteEn'), wide: true, cell: (item) => <Quote>{locale === 'sr' ? item.quoteSr : item.quoteEn}</Quote> },
    {
      key: 'status',
      header: t('newsletter.status'),
      cell: (item) => (
        <Button variant="ghost" size="s" aria-pressed={item.isPublished} onClick={() => void list.togglePublished(item)}>
          <Badge tone={item.isPublished ? 'success' : 'neutral'}>{t(item.isPublished ? 'common.published' : 'common.draft')}</Badge>
        </Button>
      ),
    },
    {
      key: 'actions',
      header: t('common.actions'),
      align: 'right',
      cell: (item) => <RowActions name={item.authorName} onEdit={() => list.edit(item)} onDelete={() => void list.remove(item)} />,
    },
  ]

  return (
    <>
      <PageHeader
        title={t('nav.testimonials')}
        lead={t('testimonials.lead')}
        actions={
          <Button iconLeft="plus" onClick={() => list.add()}>
            {t('testimonials.add')}
          </Button>
        }
      />
      <ListStatus isLoading={list.isLoading} isError={list.isError}>
        <DataTable rows={list.items} columns={columns} rowKey={(item) => item.id} empty={t('common.empty')} caption={t('nav.testimonials')} />
      </ListStatus>
    </>
  )
}

export default TestimonialsView
