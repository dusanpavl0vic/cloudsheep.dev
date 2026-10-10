import { ADMIN_API_ENDPOINTS } from '@/constants/adminApi'
import type { LoginInput } from '@/schemas/auth'
import type { SessionResponse } from '@/types/auth'

import { sessionEnded, sessionStarted } from '../../slices/auth'
import { baseApi } from '../baseApi'

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<SessionResponse, LoginInput>({
      query: (body) => ({ url: ADMIN_API_ENDPOINTS.AUTH_LOGIN, method: 'POST', body }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          dispatch(sessionStarted((await queryFulfilled).data))
        } catch {
          // Greška prijave stiže pozivaocu kroz `.unwrap()` — ovde samo da ne ostane neuhvaćena.
        }
      },
    }),
    /** Obnova sesije posle učitavanja stranice — access token je bio samo u memoriji. */
    restoreSession: build.query<SessionResponse, undefined>({
      query: () => ({ url: ADMIN_API_ENDPOINTS.AUTH_REFRESH, method: 'POST' }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        try {
          dispatch(sessionStarted((await queryFulfilled).data))
        } catch {
          dispatch(sessionEnded())
        }
      },
    }),
    logout: build.mutation<undefined, undefined>({
      query: () => ({ url: ADMIN_API_ENDPOINTS.AUTH_LOGOUT, method: 'POST' }),
      onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
        await queryFulfilled.catch(() => undefined)
        dispatch(sessionEnded())
        dispatch(baseApi.util.resetApiState())
      },
    }),
  }),
})

export const { useLoginMutation, useRestoreSessionQuery, useLogoutMutation } = authApi
