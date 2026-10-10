'use client'

import { useTranslations } from 'next-intl'

import Badge from '@/components/admin/Badge'
import DataTable, { type DataColumn } from '@/components/admin/DataTable'
import ListStatus from '@/components/admin/ListStatus'
import OrderButtons from '@/components/admin/OrderButtons'
import PageHeader from '@/components/admin/PageHeader'
import RowActions from '@/components/admin/RowActions'
import Button from '@/components/buttons/Button'
import { useTechnologies } from '@/hooks/admin/technologies'
import type { AdminTechnology } from '@/types/technology'

import { Name, Placeholder, Slug } from './TechnologiesView.styles'

/** `/admin/technologies` — logotipi u redosledu sa sajta. */
const TechnologiesView = () => {
  const t = useTranslations('admin')
  const tech = useTechnologies()

  const columns: DataColumn<AdminTechnology>[] = [
    {
      key: 'order',
      header: '#',
      cell: (item) => {
        const index = tech.items.indexOf(item)
        return (
          <OrderButtons
            name={item.label}
            canUp={tech.order.canMove(index, -1)}
            canDown={tech.order.canMove(index, 1)}
            onMove={(delta) => {
              tech.order.move(index, delta)
            }}
          />
        )
      },
    },
    {
      key: 'name',
      header: t('technologies.label'),
      cell: (item) => (
        <Name>
          {item.logoUrl ? <img src={item.logoUrl} alt="" /> : <Placeholder />}
          {item.label}
        </Name>
      ),
    },
    { key: 'slug', header: t('technologies.slug'), wide: true, cell: (item) => <Slug>{item.slug}</Slug> },
    { key: 'group', header: t('technologies.group'), wide: true, cell: (item) => <Badge>{t(`technologies.groups.${item.group}`)}</Badge> },
    {
      key: 'actions',
      header: t('common.actions'),
      align: 'right',
      cell: (item) => (
        <RowActions
          name={item.label}
          onEdit={() => tech.edit(item)}
          onDelete={() => void tech.remove(item)}
        />
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title={t('nav.technologies')}
        lead={t('technologies.lead')}
        actions={
          <Button iconLeft="plus" onClick={() => tech.add()}>
            {t('technologies.add')}
          </Button>
        }
      />
      <ListStatus isLoading={tech.isLoading} isError={tech.isError}>
        <DataTable rows={tech.items} columns={columns} rowKey={(item) => item.id} empty={t('common.empty')} caption={t('nav.technologies')} />
      </ListStatus>
    </>
  )
}

export default TechnologiesView
