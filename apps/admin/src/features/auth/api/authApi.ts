import { baseApi } from '@/store'

import type { LoginInput } from '../schemas/login.schema'
import type { AuthUser, Session } from '../types'

/**
 * Endpointi se dodaju kroz `injectEndpoints` — nikad novi `createApi` (docs/11).
 * Generisane hookove troši SAMO feature hook, nikad komponenta (docs/13).
 */
export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<Session, LoginInput>({
      query: (credentials) => ({ url: '/auth/login', method: 'POST', body: credentials }),
      invalidatesTags: ['Session'],
    }),

    logout: build.mutation<undefined, undefined>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      invalidatesTags: ['Session'],
    }),

    me: build.query<AuthUser, undefined>({
      query: () => '/auth/me',
      providesTags: ['Session'],
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation, useMeQuery } = authApi
