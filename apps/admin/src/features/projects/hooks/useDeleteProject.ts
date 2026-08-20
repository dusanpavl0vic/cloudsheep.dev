import { useCallback } from 'react'

import { useModal } from '@app/core'

import { useDeleteProjectMutation } from '../api/projectsApi'

/**
 * Brisanje uz potvrdu.
 *
 * Potvrda se **čeka**, ne prati kroz `useEffect`: `open()` vraća obećanje koje se razreši
 * kad korisnik odluči. Zato ovde nema ni `useState(false)` ni efekta koji sluša rezultat
 * (ADR 0006, docs/07 §3).
 */
export function useDeleteProject() {
  const { open } = useModal()
  const [deleteProject, { isLoading }] = useDeleteProjectMutation()

  // memo: referencijalna stabilnost — vraćena funkcija ide u props tabele.
  const remove = useCallback(
    async (id: string, projectTitle: string) => {
      const confirmed = await open<'projects.confirmDelete', boolean>('projects.confirmDelete', {
        projectTitle,
      })

      if (confirmed !== true) return { ok: false as const, cancelled: true as const }

      const result = await deleteProject(id)
      if ('error' in result) return { ok: false as const, cancelled: false as const }

      return { ok: true as const, cancelled: false as const }
    },
    [open, deleteProject],
  )

  return { remove, isLoading }
}
