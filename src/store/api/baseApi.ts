import type { WithSlice } from '@reduxjs/toolkit'
import { createApi } from '@reduxjs/toolkit/query/react'

import { API_REDUCER_PATH, API_TAGS } from '@/constants/adminApi'

import { dynamicMiddleware } from '../index'
import { rootReducer } from '../rootReducer'
import { baseQuery } from './baseQuery'

/** Bez endpointa — svaki domen ih ubacuje sam (`store/api/<domen>/index.ts`). */
export const baseApi = createApi({
  reducerPath: API_REDUCER_PATH,
  baseQuery,
  tagTypes: Object.values(API_TAGS),
  endpoints: () => ({}),
})

declare module '../rootReducer' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- augmentation lenjih slice-ova
  export interface LazyLoadedSlices extends WithSlice<typeof baseApi> {}
}

// Ubacuje se pri prvom uvozu ovog modula — dakle samo na stranicama koje zaista zovu API.
rootReducer.inject(baseApi)
dynamicMiddleware.addMiddleware(baseApi.middleware)
