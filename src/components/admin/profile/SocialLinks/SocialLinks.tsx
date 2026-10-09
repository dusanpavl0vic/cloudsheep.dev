'use client'

import { useTranslations } from 'next-intl'

import Badge from '@/components/admin/Badge'
import DataTable, { type DataColumn } from '@/components/admin/DataTable'
import OrderButtons from '@/components/admin/OrderButtons'
import Panel from '@/components/admin/Panel'
import RowActions from '@/components/admin/RowActions'
import Button from '@/components/buttons/Button'
import { useSocialLinks } from '@/hooks/admin/profile'
import type { AdminSocialLink } from '@/types/profile'

/** Kontakt linkovi u podnožju i na stranici za kontakt. */
const SocialLinks = ({ links }: { links: AdminSocialLink[] }) => {
  const t = useTranslations('admin')
  const actions = useSocialLinks(links)

  const columns: DataColumn<AdminSocialLink>[] = [
    {
      key: 'order',
      header: '#',
      cell: (link) => {
        const index = links.indexOf(link)
        return (
          <OrderButtons
            name={link.label}
            canUp={actions.order.canMove(index, -1)}
            canDown={actions.order.canMove(index, 1)}
            onMove={(delta) => {
              actions.order.move(index, delta)
            }}
          />
        )
      },
    },
    { key: 'label', header: t('profile.label'), cell: (link) => link.label },
    { key: 'url', header: t('profile.url'), wide: true, cell: (link) => link.url },
    {
      key: 'visible',
      header: t('newsletter.status'),
      cell: (link) => (
        <Button variant="ghost" size="s" aria-pressed={link.isVisible} onClick={() => void actions.toggleVisible(link)}>
          <Badge tone={link.isVisible ? 'success' : 'neutral'}>{t(link.isVisible ? 'common.visible' : 'common.hidden')}</Badge>
        </Button>
      ),
    },
    {
      key: 'actions',
      header: t('common.actions'),
      align: 'right',
      cell: (link) => <RowActions name={link.label} onEdit={() => actions.edit(link)} onDelete={() => void actions.remove(link)} />,
    },
  ]

  return (
    <Panel title={t('profile.links')}>
      <DataTable rows={links} columns={columns} rowKey={(link) => link.id} empty={t('common.empty')} caption={t('profile.linksLead')} />
      <div>
        <Button variant="secondary" size="s" iconLeft="plus" onClick={() => actions.add()}>
          {t('profile.addLink')}
        </Button>
      </div>
    </Panel>
  )
}

export default SocialLinks
