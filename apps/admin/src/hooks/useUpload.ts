import { useCallback } from 'react'

import { useUploadAssetMutation, type UploadedAsset } from '@/lib/uploadsApi'

export type UploadResult = { ok: true; asset: UploadedAsset } | { ok: false; messageKey: string }

/** Ključevi grešaka koje server vraća za upload; sve ostalo je nepredviđeno. */
const KNOWN = new Set([
  'uploads.errors.unsupportedType',
  'uploads.errors.tooLarge',
  'uploads.errors.unreadable',
])

/**
 * Otpremanje jedne datoteke, sa greškom kao PODATKOM umesto izuzetka.
 *
 * Komponenta tako može da prikaže poruku pored polja, a ne da hvata `throw` — isti obrazac
 * kao `useLogin` (docs/13).
 */
export function useUpload() {
  const [uploadAsset, { isLoading }] = useUploadAssetMutation()

  // memo: referencijalna stabilnost — funkcija ide u props komponente za otpremanje
  const upload = useCallback(
    async (file: File): Promise<UploadResult> => {
      const result = await uploadAsset(file)

      // `'data' in result` ne sužava tip dovoljno — RTKQ ga tipizuje kao moguće `undefined`
      if (result.data) return { ok: true, asset: result.data }

      const details = (result.error as { details?: { messageKey?: string } }).details
      const key = details?.messageKey
      return { ok: false, messageKey: key && KNOWN.has(key) ? key : 'uploads.errors.failed' }
    },
    [uploadAsset],
  )

  return { upload, isUploading: isLoading }
}
