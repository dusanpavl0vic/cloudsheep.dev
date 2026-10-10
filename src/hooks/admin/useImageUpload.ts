'use client'

import { useUploadImageMutation } from '@/store/api/admin/uploads'
import type { Asset } from '@/types/media'

import { useAdminAction } from './useAdminAction'

/** Otpremanje slike iz `<input type="file">`; greška (tip, veličina) ide u toast. */
export const useImageUpload = (onUploaded: (asset: Asset) => void) => {
  const [upload, { isLoading }] = useUploadImageMutation()
  const { run } = useAdminAction()

  return {
    isUploading: isLoading,
    pick: async (file: File | undefined) => {
      if (!file) return
      const asset = await run(() => upload(file).unwrap())
      if (asset) onUploaded(asset)
    },
  }
}
