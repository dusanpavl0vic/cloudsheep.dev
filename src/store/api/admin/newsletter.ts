import { ADMIN_API_ENDPOINTS, API_LIST_ID, API_TAGS } from '@/constants/adminApi'
import type { AdminSubscriber } from '@/types/newsletter'

import { baseApi } from '../baseApi'

const LIST = { type: API_TAGS.SUBSCRIBER, id: API_LIST_ID } as const

export const newsletterApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSubscribers: build.query<AdminSubscriber[], undefined>({
      query: () => ADMIN_API_ENDPOINTS.ADMIN_SUBSCRIBERS,
      transformResponse: (response: { items: AdminSubscriber[] }) => response.items,
      providesTags: [LIST],
    }),
    deleteSubscriber: build.mutation<undefined, string>({
      query: (id) => ({ url: ADMIN_API_ENDPOINTS.ADMIN_SUBSCRIBER(id), method: 'DELETE' }),
      invalidatesTags: [LIST],
    }),
    /** CSV kao tekst — preuzimanje kroz Blob, jer link ne može da nosi Authorization zaglavlje. */
    exportSubscribers: build.mutation<string, undefined>({
      query: () => ({ url: ADMIN_API_ENDPOINTS.ADMIN_SUBSCRIBERS_EXPORT, responseHandler: 'text' }),
    }),
  }),
})

export const { useGetSubscribersQuery, useDeleteSubscriberMutation, useExportSubscribersMutation } = newsletterApi
