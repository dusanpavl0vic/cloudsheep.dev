import { ADMIN_API_ENDPOINTS, API_LIST_ID, API_TAGS } from '@/constants/adminApi'
import type { AdminMessageList } from '@/types/contact'

import { baseApi } from '../baseApi'

const LIST = { type: API_TAGS.MESSAGE, id: API_LIST_ID } as const

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMessages: build.query<AdminMessageList, 'all' | 'unread'>({
      query: (status) => ({ url: ADMIN_API_ENDPOINTS.ADMIN_MESSAGES, params: { status } }),
      providesTags: [LIST],
    }),
    markMessageRead: build.mutation<undefined, { id: string; isRead: boolean }>({
      query: ({ id, isRead }) => ({ url: ADMIN_API_ENDPOINTS.ADMIN_MESSAGE(id), method: 'PATCH', body: { isRead } }),
      invalidatesTags: [LIST],
    }),
    deleteMessage: build.mutation<undefined, string>({
      query: (id) => ({ url: ADMIN_API_ENDPOINTS.ADMIN_MESSAGE(id), method: 'DELETE' }),
      invalidatesTags: [LIST, { type: API_TAGS.SLOT, id: API_LIST_ID }],
    }),
  }),
})

export const { useGetMessagesQuery, useMarkMessageReadMutation, useDeleteMessageMutation } = messagesApi
