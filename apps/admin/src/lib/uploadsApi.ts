import { baseApi } from '@/store'

export interface UploadedAsset {
  id: string
  url: string
  width: number
  height: number
  sizeBytes: number
  mimeType: string
  label: string
}

/**
 * Otpremanje datoteke. Stoji u `lib/`, a ne u nekom feature-u, jer ga koriste dva:
 * logotipi tehnologija i slike projekata (docs/01 §2 — deljena logika ide iznad feature-a).
 *
 * RTK Query prosleđuje `FormData` kroz `body` bez diranja, i namerno NE postavlja
 * `Content-Type`: granicu multipart tela zna samo pretraživač, pa je ručno postavljeno
 * zaglavlje razbija.
 */
export const uploadsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    uploadAsset: build.mutation<UploadedAsset, File>({
      query: (file) => {
        const body = new FormData()
        body.append('file', file)
        return { url: '/admin/uploads', method: 'POST', body }
      },
    }),
  }),
})

export const { useUploadAssetMutation } = uploadsApi
