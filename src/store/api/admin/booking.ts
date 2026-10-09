import { API_ENDPOINTS, API_LIST_ID, API_TAGS } from '@/constants/api'
import type { GenerateSlotsInput } from '@/schemas/booking'
import type { AdminBookingSlot } from '@/types/booking'

import { baseApi } from '../baseApi'

const LIST = { type: API_TAGS.SLOT, id: API_LIST_ID } as const

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getSlots: build.query<AdminBookingSlot[], undefined>({
      query: () => API_ENDPOINTS.ADMIN_SLOTS,
      transformResponse: (response: { items: AdminBookingSlot[] }) => response.items,
      providesTags: [LIST],
    }),
    generateSlots: build.mutation<{ created: number }, GenerateSlotsInput>({
      query: (body) => ({ url: API_ENDPOINTS.ADMIN_SLOTS_GENERATE, method: 'POST', body }),
      invalidatesTags: [LIST],
    }),
    /** Oslobađa zauzet termin (upit ostaje, samo bez termina). */
    releaseSlot: build.mutation<undefined, string>({
      query: (id) => ({ url: API_ENDPOINTS.ADMIN_SLOT(id), method: 'PATCH' }),
      invalidatesTags: [LIST, { type: API_TAGS.MESSAGE, id: API_LIST_ID }],
    }),
    deleteSlot: build.mutation<undefined, string>({
      query: (id) => ({ url: API_ENDPOINTS.ADMIN_SLOT(id), method: 'DELETE' }),
      invalidatesTags: [LIST],
    }),
  }),
})

export const { useGetSlotsQuery, useGenerateSlotsMutation, useReleaseSlotMutation, useDeleteSlotMutation } = bookingApi
