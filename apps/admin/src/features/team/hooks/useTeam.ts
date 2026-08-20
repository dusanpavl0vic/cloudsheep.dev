import { useCallback } from 'react'

import { useModal } from '@app/core'

import {
  useCreateMemberMutation,
  useDeleteMemberMutation,
  useReorderTeamMutation,
  useTeamQuery,
  useUpdateMemberMutation,
} from '../api/teamApi'
import type { TeamMemberInput } from '../schemas/team.schema'
import type { TeamMember } from '../types'

/** Modul-konstanta — `?? []` bi pravio nov niz na svaki render (docs/07 §2). */
const EMPTY: readonly TeamMember[] = []

export function useTeam() {
  const { open } = useModal()
  const { data, isLoading, error } = useTeamQuery(undefined)
  const [create, { isLoading: isCreating }] = useCreateMemberMutation()
  const [update, { isLoading: isUpdating }] = useUpdateMemberMutation()
  const [reorder, { isLoading: isReordering }] = useReorderTeamMutation()
  const [remove] = useDeleteMemberMutation()

  // memo: referencijalna stabilnost — sve idu u props komponenti
  const save = useCallback(
    async (values: TeamMemberInput, id?: string) => {
      const result = id ? await update({ id, body: values }) : await create(values)
      return { ok: !('error' in result) }
    },
    [create, update],
  )

  const toggleVisible = useCallback(
    (member: TeamMember) => {
      void update({ id: member.id, body: { isVisible: !member.isVisible } })
    },
    [update],
  )

  const move = useCallback(
    (members: readonly TeamMember[], index: number, direction: -1 | 1) => {
      const target = index + direction
      if (target < 0 || target >= members.length) return

      const ids = members.map((member) => member.id)
      const moved = ids[index]
      const replaced = ids[target]
      if (!moved || !replaced) return

      ids[index] = replaced
      ids[target] = moved
      void reorder(ids)
    },
    [reorder],
  )

  const confirmDelete = useCallback(
    async (member: TeamMember) => {
      const confirmed = await open<'team.confirmDelete', boolean>('team.confirmDelete', {
        fullName: member.fullName,
      })
      if (confirmed !== true) return

      void remove(member.id)
    },
    [open, remove],
  )

  return {
    members: data?.items ?? EMPTY,
    save,
    toggleVisible,
    move,
    confirmDelete,
    isLoading,
    isSaving: isCreating || isUpdating,
    isBusy: isReordering || isUpdating,
    error,
  }
}
