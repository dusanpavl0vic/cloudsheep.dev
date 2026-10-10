'use client'

import { useTranslations } from 'next-intl'

import { MODALS } from '@/constants/modals'
import { useDeleteTeamMemberMutation, useGetTeamQuery, useReorderTeamMutation, useUpdateTeamMemberMutation } from '@/store/api/admin/team'
import type { AdminTeamMember } from '@/types/team'

import { useModal } from '../../useModal'
import { useAdminAction } from '../useAdminAction'
import { useReorder } from '../useReorder'

/** Tim: redosled, vidljivost jednim klikom, dijalog za izmenu, brisanje (sa CV-jem). */
export const useTeam = () => {
  const t = useTranslations('admin.team')
  const query = useGetTeamQuery(undefined)
  const [reorder] = useReorderTeamMutation()
  const [update] = useUpdateTeamMemberMutation()
  const [deleteMember] = useDeleteTeamMemberMutation()
  const { run, remove } = useAdminAction()
  const form = useModal(MODALS.ADMIN_TEAM_MEMBER_FORM)
  const items = query.data ?? []

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    order: useReorder(items, (ids) => reorder(ids).unwrap()),
    add: () => form.open(),
    edit: (member: AdminTeamMember) => form.open({ id: member.id }),
    toggleVisible: (member: AdminTeamMember) => run(() => update({ id: member.id, patch: { isVisible: !member.isVisible } }).unwrap(), 'saved'),
    remove: (member: AdminTeamMember) => remove(t('deleteConfirm', { name: member.fullName }), () => deleteMember(member.id).unwrap()),
  }
}
