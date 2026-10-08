import { API_ENDPOINTS } from '@/constants/api'
import type { SubscribeInput } from '@/schemas/newsletter'

import { baseApi } from '../baseApi'

export const newsletterApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    subscribe: build.mutation<{ ok: true }, SubscribeInput>({
      query: (body) => ({ url: API_ENDPOINTS.NEWSLETTER, method: 'POST', body }),
    }),
  }),
})

export const { useSubscribeMutation } = newsletterApi
