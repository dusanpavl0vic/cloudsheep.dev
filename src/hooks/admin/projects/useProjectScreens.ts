'use client'

import { useTranslations } from 'next-intl'

import type { UpdateImageInput } from '@/schemas/project'
import {
  useAddProjectImageMutation,
  useDeleteProjectImageMutation,
  useReorderProjectImagesMutation,
  useUpdateProjectImageMutation,
} from '@/store/api/admin/projects'
import type { AdminProject, AdminProjectImage, DeviceKind } from '@/types/project'

import { useAdminAction } from '../useAdminAction'
import { useImageUpload } from '../useImageUpload'
import { useReorder } from '../useReorder'

/**
 * Ekrani projekta (studija slučaja i galerija). Svaka izmena se čuva odmah — slika je već
 * otpremljena, pa nema smisla čekati „Sačuvaj" forme.
 */
export const useProjectScreens = (project: AdminProject) => {
  const t = useTranslations('admin.projects')
  const [add] = useAddProjectImageMutation()
  const [update] = useUpdateProjectImageMutation()
  const [deleteImage] = useDeleteProjectImageMutation()
  const [reorder] = useReorderProjectImagesMutation()
  const { run, remove } = useAdminAction()
  const items = project.images
  const patch = (image: AdminProjectImage, change: UpdateImageInput) =>
    run(() => update({ projectId: project.id, imageId: image.id, patch: change }).unwrap())

  return {
    items,
    upload: useImageUpload((asset) => {
      void run(() => add({ projectId: project.id, assetId: asset.id }).unwrap(), 'saved')
    }),
    order: useReorder(items, (ids) => reorder({ projectId: project.id, ids }).unwrap()),
    setDevice: (image: AdminProjectImage, device: DeviceKind | null) => patch(image, { device }),
    /** Opis se čuva kad polje izgubi fokus, i samo ako je promenjen. */
    setAlt: (image: AdminProjectImage, field: 'altSr' | 'altEn', value: string) =>
      value.trim() === image[field] ? undefined : patch(image, { [field]: value.trim() }),
    remove: (image: AdminProjectImage) =>
      remove(t('deleteScreenConfirm'), () => deleteImage({ projectId: project.id, imageId: image.id }).unwrap()),
  }
}
