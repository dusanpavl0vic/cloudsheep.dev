import {
  authReducer,
  selectAccessToken,
  sessionRefreshed,
  loggedOut,
} from '@/features/auth/store/auth.slice'
import type { Session } from '@/features/auth/types'
import { env } from '@/lib/env'
import { createBaseApi, createStore } from '@app/core'

/**
 * Jedini `createApi` u app-i. Feature-i dodaju endpointe kroz `injectEndpoints`.
 *
 * `selectToken` čita iz auth slice-a — token je u memoriji, nikad u localStorage.
 * Refresh mutex je unutra: pet paralelnih 401 odgovora daje jedan refresh (docs/11).
 */
export const baseApi = createBaseApi({
  baseUrl: env.VITE_API_URL,
  selectToken: (state) => selectAccessToken(state as { auth: { session: Session | null } }),
  onRefreshed: (data) => sessionRefreshed(data as Session),
  onSessionExpired: () => loggedOut(),
  tagTypes: ['Session', 'Project', 'Technology', 'Profile', 'TeamMember', 'Message'],
})

export const store = createStore({
  reducers: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  apiMiddleware: [baseApi.middleware],
  devMode: import.meta.env.DEV,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
