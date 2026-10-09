import { API_ENDPOINTS } from '@/constants/api'
import type { Asset } from '@/types/media'

import { baseApi } from '../baseApi'

export const uploadsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    /** `multipart/form-data` — fetchBaseQuery ne postavlja Content-Type za FormData (granica ide sama). */
    uploadImage: build.mutation<Asset, File>({
      query: (file) => {
        const body = new FormData()
        body.append('file', file)
        return { url: API_ENDPOINTS.ADMIN_UPLOADS, method: 'POST', body }
      },
    }),
  }),
})

export const { useUploadImageMutation } = uploadsApi
