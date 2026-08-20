import { useCallback } from 'react'

import { useReorderProjectsMutation, useUpdateProjectMutation } from '../api/projectsApi'
import type { AdminProject } from '../types'

/**
 * Redosled projekata i prekidač „na početnoj", oba iz same tabele.
 *
 * Ulazak u formu zbog jednog čekboksa je posao koji niko ne traži; a redosled se ionako
 * ne može podesiti u formi jednog projekta, jer je relativan prema ostalima.
 */
export function useProjectOrder() {
  const [reorder, { isLoading: isReordering }] = useReorderProjectsMutation()
  const [update, { isLoading: isToggling }] = useUpdateProjectMutation()

  // memo: referencijalna stabilnost — obe idu u props tabele
  const move = useCallback(
    (projects: readonly AdminProject[], index: number, direction: -1 | 1) => {
      const target = index + direction
      if (target < 0 || target >= projects.length) return

      const ids = projects.map((project) => project.id)
      const moved = ids[index]
      const replaced = ids[target]
      if (!moved || !replaced) return

      ids[index] = replaced
      ids[target] = moved

      // Ceo novi poredak ide serveru, ne samo pomerena stavka — inače bi se dva
      // istovremena pomeranja poništila
      void reorder(ids)
    },
    [reorder],
  )

  const toggleFeatured = useCallback(
    (project: AdminProject) => {
      void update({
        id: project.id,
        // `PATCH` je delimičan: šalje se samo ono što se menja
        body: { isFeatured: !project.isFeatured } as never,
      })
    },
    [update],
  )

  const togglePublished = useCallback(
    (project: AdminProject) => {
      void update({ id: project.id, body: { isPublished: !project.isPublished } as never })
    },
    [update],
  )

  return { move, toggleFeatured, togglePublished, isBusy: isReordering || isToggling }
}
