import { baseApi } from '@/store'

import type { LoginInput } from '../schemas/login.schema'
import { loggedOut, sessionRefreshed } from '../store/auth.slice'
import type { Session } from '../types'

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

    /**
     * Obnova sesije pri pokretanju app-e.
     *
     * Access token namerno živi samo u memoriji (docs/20), pa nestaje sa svakim osvežavanjem
     * stranice. Refresh token je u `httpOnly` cookie-ju i preživi — ovaj poziv ga menja za
     * nov par. Bez njega je Redux posle reload-a prazan, `RequireAuth` vidi „neulogovan" i
     * šalje na prijavu, pa panel traži lozinku pri svakom ulasku.
     *
     * **`query`, ne `mutation`** — da bi RTKQ sam ispalio poziv pri montiranju. Kao mutacija
     * bi tražila `useEffect` i zastavicu „već pokrenuto", a to je stanje koje ne mora da
     * postoji.
     *
     * **Bez `providesTags`**, namerno: `login` i `logout` invalidiraju `['Session']`, pa bi
     * sa tagom svaka prijava i odjava okinula još jednu rotaciju refresh tokena.
     *
     * Sesiju upisuje `onQueryStarted`, a ne `createBaseApi`: njegov `onRefreshed` se pali
     * samo kad refresh krene IZ 401 odgovora, a ovde nema prethodnog zahteva.
     */
    restoreSession: build.query<Session, undefined>({
      query: () => ({ url: '/auth/refresh', method: 'POST' }),
      async onQueryStarted(_arg, { dispatch, queryFulfilled }) {
        try {
          dispatch(sessionRefreshed((await queryFulfilled).data))
        } catch {
          // Nema cookie-ja ili je istekao — to je uredno stanje, ne greška za korisnika
          dispatch(loggedOut())
        }
      },
    }),
  }),
})

export const { useLoginMutation, useLogoutMutation, useRestoreSessionQuery } = authApi
