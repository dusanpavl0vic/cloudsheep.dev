import { API_ENDPOINTS, API_TAGS } from '@/constants/api'
import type { BookingSlot } from '@/types/booking'

import { baseApi } from '../baseApi'

export const bookingApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getFreeSlots: build.query<BookingSlot[], undefined>({
      query: () => API_ENDPOINTS.BOOKING_SLOTS,
      transformResponse: (response: { items: BookingSlot[] }) => response.items,
      providesTags: [{ type: API_TAGS.SLOT, id: 'LIST' }],
    }),
  }),
})

export const { useGetFreeSlotsQuery } = bookingApi
