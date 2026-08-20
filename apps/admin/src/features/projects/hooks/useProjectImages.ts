import { useCallback } from 'react'

import { useUpload } from '@/hooks/useUpload'

import {
  useAttachImageMutation,
  useDeleteImageMutation,
  useReorderImagesMutation,
  useUpdateImageMutation,
} from '../api/projectsApi'
import type { ProjectImage } from '../types'

/**
 * Slike jednog projekta: otpremanje, opis, redosled, brisanje.
 *
 * Otpremanje je DVA koraka namerno — prvo datoteka (`/admin/uploads`), pa kačenje na
 * projekat. Tako ista datoteka može stajati na dva mesta, a neuspelo kačenje ne znači da
 * je otpremanje palo.
 */
export function useProjectImages(projectId: string | undefined) {
  const { upload, isUploading } = useUpload()
  const [attach, { isLoading: isAttaching }] = useAttachImageMutation()
  const [updateImage] = useUpdateImageMutation()
  const [reorder] = useReorderImagesMutation()
  const [remove] = useDeleteImageMutation()

  // memo: referencijalna stabilnost — sve četiri idu u props komponente
  const add = useCallback(
    async (file: File) => {
      if (!projectId) return { ok: false as const, messageKey: 'projects.images.saveFirst' }

      const uploaded = await upload(file)
      if (!uploaded.ok) return { ok: false as const, messageKey: uploaded.messageKey }

      const result = await attach({
        projectId,
        // Opis se popunjava posle, u polju pored slike — otpremanje se ne zaustavlja zbog njega
        body: { assetId: uploaded.asset.id, altSr: '', altEn: '' },
      })

      return 'error' in result
        ? { ok: false as const, messageKey: 'projects.images.attachFailed' }
        : { ok: true as const }
    },
    [projectId, upload, attach],
  )

  const setAlt = useCallback(
    (imageId: string, body: { altSr?: string; altEn?: string }) => {
      if (!projectId) return
      void updateImage({ projectId, imageId, body })
    },
    [projectId, updateImage],
  )

  /** Pomeranje za jedno mesto. Ceo novi poredak ide serveru, ne samo pomerena stavka. */
  const move = useCallback(
    (images: readonly ProjectImage[], index: number, direction: -1 | 1) => {
      const target = index + direction
      if (!projectId || target < 0 || target >= images.length) return

      const ids = images.map((image) => image.id)
      const moved = ids[index]
      const replaced = ids[target]
      if (!moved || !replaced) return

      ids[index] = replaced
      ids[target] = moved

      void reorder({ projectId, ids })
    },
    [projectId, reorder],
  )

  const removeImage = useCallback(
    (imageId: string) => {
      if (!projectId) return
      void remove({ projectId, imageId })
    },
    [projectId, remove],
  )

  return { add, setAlt, move, removeImage, isBusy: isUploading || isAttaching }
}
