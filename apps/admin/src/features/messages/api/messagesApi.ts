import { baseApi } from '@/store'

import type { MessageListResponse } from '../types'

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    messages: build.query<MessageListResponse, 'all' | 'unread'>({
      query: (status) => `/admin/messages?status=${status}`,
      providesTags: [{ type: 'Message', id: 'LIST' }],
    }),

    markRead: build.mutation<undefined, { id: string; isRead: boolean }>({
      query: ({ id, isRead }) => ({
        url: `/admin/messages/${id}`,
        method: 'PATCH',
        body: { isRead },
      }),
      invalidatesTags: [{ type: 'Message', id: 'LIST' }],
    }),

    deleteMessage: build.mutation<undefined, string>({
      query: (id) => ({ url: `/admin/messages/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Message', id: 'LIST' }],
    }),
  }),
})

export const { useMessagesQuery, useMarkReadMutation, useDeleteMessageMutation } = messagesApi
