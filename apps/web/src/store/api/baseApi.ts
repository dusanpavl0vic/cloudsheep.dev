import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

import { APP_CONFIG } from '@/constants/config'

// Bazni RTK Query API — svaki feature dodaje svoje endpointe kroz injectEndpoints
// (vidi PROJECT_GUIDE.md sekciju 6 i primer u features/home/homeApi.ts)
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: APP_CONFIG.apiUrl }),
  tagTypes: [],
  endpoints: () => ({}),
})
