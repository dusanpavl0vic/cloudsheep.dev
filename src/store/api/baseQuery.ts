import { fetchBaseQuery, type BaseQueryFn, type FetchArgs, type FetchBaseQueryError } from '@reduxjs/toolkit/query/react'

import { API_BASE_URL, API_ENDPOINTS } from '@/constants/api'
import { HTTP_STATUS } from '@/constants/http'
import type { SessionResponse } from '@/types/auth'

import type { RootState } from '../index'
import { selectAccessToken, sessionEnded, sessionStarted } from '../slices/auth'

/** Isto poreklo, pa `same-origin` nosi kolačić refresh tokena bez CORS-a. */
const rawBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  credentials: 'same-origin',
  prepareHeaders: (headers, { getState }) => {
    const token = selectAccessToken(getState() as RootState)
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return headers
  },
})

const urlOf = (args: string | FetchArgs) => (typeof args === 'string' ? args : args.url)

/** Prijava/obnova/odjava se ne obnavljaju same sebi — inače 401 na obnovi pravi petlju. */
const isAuthCall = (args: string | FetchArgs) => urlOf(args).startsWith('/auth/')

/** Jedna obnova u letu: istovremeni 401-ovi čekaju isti odgovor (docs/11 §4). */
let refreshing: Promise<boolean> | null = null

/**
 * Admin zahtevi nose access token iz memorije. Na 401 jednom obnavlja sesiju (httpOnly kolačić)
 * i ponavlja zahtev; ako obnova ne uspe → `sessionEnded` i admin ide na prijavu. 403 (pogrešna
 * uloga) se ne obnavlja — obnova ne bi pomogla.
 */
export const baseQuery: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions)
  if (result.error?.status !== HTTP_STATUS.UNAUTHORIZED || isAuthCall(args)) return result

  refreshing ??= (async () => {
    const refreshed = await rawBaseQuery({ url: API_ENDPOINTS.AUTH_REFRESH, method: 'POST' }, api, extraOptions)
    if (refreshed.data) {
      api.dispatch(sessionStarted(refreshed.data as SessionResponse))
      return true
    }
    api.dispatch(sessionEnded())
    return false
  })().finally(() => {
    refreshing = null
  })

  return (await refreshing) ? rawBaseQuery(args, api, extraOptions) : result
}
