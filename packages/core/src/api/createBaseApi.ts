import {
  createApi,
  fetchBaseQuery,
  type BaseQueryFn,
  type FetchArgs,
} from '@reduxjs/toolkit/query/react'

import { Mutex } from './mutex'
import { normalizeError, type AppError } from '../errors/AppError'

interface CreateBaseApiOptions {
  baseUrl: string
  /** Čita access token iz store-a; token živi u memoriji, nikad u localStorage (docs/20). */
  selectToken: (state: unknown) => string | null
  /** Endpoint za obnovu sesije. */
  refreshUrl?: string
  /** Poziva se kad refresh uspe — app upisuje novu sesiju u svoj slice. */
  onRefreshed?: (data: unknown) => { type: string; payload: unknown }
  /** Poziva se kad refresh padne — app briše sesiju. */
  onSessionExpired?: () => { type: string; payload?: unknown }
  tagTypes?: readonly string[]
}

/**
 * Jedini `createApi` u sistemu. Feature-i dodaju endpointe kroz `injectEndpoints`
 * (docs/11-data-fetching.md).
 */
export function createBaseApi({
  baseUrl,
  selectToken,
  refreshUrl = '/auth/refresh',
  onRefreshed,
  onSessionExpired,
  tagTypes = [],
}: CreateBaseApiOptions) {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl,
    // Refresh token je u httpOnly cookie-ju — mora ići uz zahtev
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const token = selectToken(getState())
      if (token) headers.set('authorization', `Bearer ${token}`)
      return headers
    },
  })

  const mutex = new Mutex()

  const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, AppError> = async (
    args,
    api,
    extraOptions,
  ) => {
    // Ako je refresh u toku, sačekaj ga umesto da pošalješ zahtev sa mrtvim tokenom
    await mutex.waitForUnlock()

    let result = await rawBaseQuery(args, api, extraOptions)

    if (result.error?.status === 401) {
      if (mutex.isLocked) {
        // Neko drugi obnavlja sesiju — sačekaj pa ponovi originalni zahtev
        await mutex.waitForUnlock()
        result = await rawBaseQuery(args, api, extraOptions)
      } else {
        const release = await mutex.acquire()
        try {
          const refresh = await rawBaseQuery({ url: refreshUrl, method: 'POST' }, api, extraOptions)

          if (refresh.data !== undefined && onRefreshed) {
            api.dispatch(onRefreshed(refresh.data))
            result = await rawBaseQuery(args, api, extraOptions)
          } else if (onSessionExpired) {
            api.dispatch(onSessionExpired())
          }
        } finally {
          release()
        }
      }
    }

    if (result.error) {
      return { error: normalizeError(result.error) }
    }

    return { data: result.data }
  }

  return createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    tagTypes: [...tagTypes],
    endpoints: () => ({}),
  })
}
