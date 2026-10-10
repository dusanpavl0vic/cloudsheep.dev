'use client'

import NextLink from 'next/link'
import { useLocale, useTranslations } from 'next-intl'

import Badge from '@/components/admin/Badge'
import DataTable, { type DataColumn } from '@/components/admin/DataTable'
import ListStatus from '@/components/admin/ListStatus'
import OrderButtons from '@/components/admin/OrderButtons'
import PageHeader from '@/components/admin/PageHeader'
import RowActions from '@/components/admin/RowActions'
import Button from '@/components/buttons/Button'
import { adminTeamCvHref } from '@/constants/routes'
import { useTeam } from '@/hooks/admin/team'
import type { AdminTeamMember } from '@/types/team'

import { Actions, Person } from './TeamView.styles'

/** `/admin/team` — članovi tima, vidljivost i CV. */
const TeamView = () => {
  const t = useTranslations('admin')
  const locale = useLocale()
  const team = useTeam()

  const columns: DataColumn<AdminTeamMember>[] = [
    {
      key: 'order',
      header: '#',
      cell: (member) => {
        const index = team.items.indexOf(member)
        return (
          <OrderButtons
            name={member.fullName}
            canUp={team.order.canMove(index, -1)}
            canDown={team.order.canMove(index, 1)}
            onMove={(delta) => {
              team.order.move(index, delta)
            }}
          />
        )
      },
    },
    {
      key: 'name',
      header: t('team.name'),
      cell: (member) => (
        <Person>
          {member.avatarUrl ? <img src={member.avatarUrl} alt="" /> : <i />}
          <span>
            {member.fullName}
            <small>{locale === 'sr' ? member.roleSr : member.roleEn}</small>
          </span>
        </Person>
      ),
    },
    {
      key: 'visible',
      header: t('newsletter.status'),
      cell: (member) => (
        <Button variant="ghost" size="s" aria-pressed={member.isVisible} onClick={() => void team.toggleVisible(member)}>
          <Badge tone={member.isVisible ? 'success' : 'neutral'}>{t(member.isVisible ? 'common.visible' : 'common.hidden')}</Badge>
        </Button>
      ),
    },
    {
      key: 'actions',
      header: t('common.actions'),
      align: 'right',
      cell: (member) => (
        <Actions>
          <Button href={adminTeamCvHref(member.id)} linkComponent={NextLink} variant="secondary" size="s">
            {t('team.cv')}
          </Button>
          <RowActions name={member.fullName} onEdit={() => team.edit(member)} onDelete={() => void team.remove(member)} />
        </Actions>
      ),
    },
  ]

  return (
    <>
      <PageHeader
        title={t('nav.team')}
        lead={t('team.lead')}
        actions={
          <Button iconLeft="plus" onClick={() => team.add()}>
            {t('team.add')}
          </Button>
        }
      />
      <ListStatus isLoading={team.isLoading} isError={team.isError}>
        <DataTable rows={team.items} columns={columns} rowKey={(member) => member.id} empty={t('common.empty')} caption={t('nav.team')} />
      </ListStatus>
    </>
  )
}

export default TeamView
