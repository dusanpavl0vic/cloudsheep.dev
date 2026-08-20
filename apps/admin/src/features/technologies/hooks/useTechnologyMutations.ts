import { useCallback } from 'react'

import { fieldFromError } from '@/lib/apiError'
import { useModal } from '@app/core'

import {
  useCreateTechnologyMutation,
  useDeleteTechnologyMutation,
  useUpdateTechnologyMutation,
} from '../api/technologiesApi'
import type { TechnologyInput } from '../schemas/technology.schema'

/**
 * Čuvanje i brisanje tehnologije.
 *
 * Brisanje traži potvrdu jer kaskadno skida tehnologiju sa SVIH projekata koji je koriste —
 * to se ne vidi sa ekrana sa kog se briše.
 */
export function useTechnologyMutations() {
  const { open } = useModal()
  const [create, { isLoading: isCreating }] = useCreateTechnologyMutation()
  const [update, { isLoading: isUpdating }] = useUpdateTechnologyMutation()
  const [remove, { isLoading: isDeleting }] = useDeleteTechnologyMutation()

  // memo: referencijalna stabilnost — obe funkcije idu u props komponenti
  const save = useCallback(
    async (values: TechnologyInput, id?: string) => {
      const result = id ? await update({ id, body: values }) : await create(values)

      if ('error' in result) return { ok: false as const, field: fieldFromError(result.error) }
      return { ok: true as const }
    },
    [create, update],
  )

  const confirmDelete = useCallback(
    async (id: string, label: string) => {
      const confirmed = await open<'technologies.confirmDelete', boolean>(
        'technologies.confirmDelete',
        { label },
      )
      if (confirmed !== true) return { ok: false as const }

      const result = await remove(id)
      return { ok: !('error' in result) }
    },
    [open, remove],
  )

  return { save, confirmDelete, isSaving: isCreating || isUpdating, isDeleting }
}
