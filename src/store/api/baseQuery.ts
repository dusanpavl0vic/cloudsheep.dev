import { fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { API_BASE_URL } from '@/constants/api'

/**
 * Isto poreklo, pa `same-origin` nosi kolačiće (refresh token admin-a) bez CORS-a.
 * Admin ga u fazi sa sesijom obmotava `baseQueryWithReauth` (docs/11-data-fetching.md §4).
 */
export const baseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'same-origin',
})
