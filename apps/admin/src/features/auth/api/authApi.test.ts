import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import { loggedOut, sessionEstablished } from '@/features/auth/store/auth.slice'
import { store } from '@/store'

import { selectCurrentUser, selectIsAuthenticated } from '../store/auth.slice'
import type { AuthUser, Session } from '../types'
import { authApi } from './authApi'

/**
 * `createStore` iz `@app/core` tipizira `dispatch` kao običan `Dispatch`, pa TS ne vidi da
 * RTKQ thunk vraća „thenable" rezultat sa `.unsubscribe()`. Pomoćnica to sužava na jednom
 * mestu umesto castova razbacanih po svakom testu.
 */
type QueryResult<T> = PromiseLike<{ data?: T; error?: unknown }> & { unsubscribe: () => void }

const dispatchQuery = <T>(thunk: unknown) =>
  store.dispatch(thunk as never) as unknown as QueryResult<T>

const API = 'http://localhost:3000'

const user: AuthUser = { id: 'usr_1', email: 'a@b.rs', name: 'Marko', role: 'admin' }
const session: Session = { user, accessToken: 'token-1' }

const server = setupServer()

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})
afterEach(() => {
  server.resetHandlers()
  store.dispatch(loggedOut())
  store.dispatch(authApi.util.resetApiState())
})
afterAll(() => {
  server.close()
})

/*
 * Kačenje Bearer tokena, mutex i ponavljanje zahteva posle 401 su posao `createBaseApi` i
 * pokriveni su u `packages/core/src/api/createBaseApi.test.ts`. Ovde se testira samo ono
 * što je svojstveno ovim endpointima.
 */
describe('authApi', () => {
  it('`restoreSession` upisuje sesiju u store — bez toga panel traži prijavu posle svakog reload-a', async () => {
    server.use(http.post(`${API}/auth/refresh`, () => HttpResponse.json(session)))

    await dispatchQuery<Session>(authApi.endpoints.restoreSession.initiate(undefined))

    expect(selectCurrentUser(store.getState())).toEqual(user)
    expect(selectIsAuthenticated(store.getState())).toBe(true)
  })

  it('`restoreSession` bez važećeg cookie-ja briše sesiju i ne baca', async () => {
    store.dispatch(sessionEstablished(session))
    server.use(
      http.post(`${API}/auth/refresh`, () =>
        HttpResponse.json({ messageKey: 'errors.unauthorized' }, { status: 401 }),
      ),
    )

    const result = await dispatchQuery<Session>(
      authApi.endpoints.restoreSession.initiate(undefined),
    )

    expect(result.error).toBeDefined()
    expect(selectIsAuthenticated(store.getState())).toBe(false)
  })

  /*
   * `restoreSession` NEMA `providesTags`, i to je namerno: `login` i `logout` invalidiraju
   * `['Session']`, pa bi sa tagom svaka prijava okinula još jednu rotaciju refresh tokena —
   * a rotacija briše stari red u bazi. Ovaj test čuva tu odluku.
   */
  it('`login` NE okida ponovnu obnovu sesije', async () => {
    let refreshCalls = 0
    server.use(
      http.post(`${API}/auth/refresh`, () => {
        refreshCalls += 1
        return HttpResponse.json(session)
      }),
      http.post(`${API}/auth/login`, () => HttpResponse.json(session)),
    )

    // Pretplata mora ostati živa, inače RTKQ nema šta da ponovo dohvati
    const subscription = dispatchQuery<Session>(
      authApi.endpoints.restoreSession.initiate(undefined),
    )
    await subscription
    expect(refreshCalls).toBe(1)

    await dispatchQuery<Session>(
      authApi.endpoints.login.initiate({
        email: user.email,
        password: 'tajna123',
        rememberMe: false,
      }),
    )

    expect(refreshCalls).toBe(1)
    subscription.unsubscribe()
  })

  it('greška sa servera izlazi normalizovana', async () => {
    server.use(http.post(`${API}/auth/login`, () => HttpResponse.json({}, { status: 500 })))

    const result = await dispatchQuery<Session>(
      authApi.endpoints.login.initiate({
        email: user.email,
        password: 'tajna123',
        rememberMe: false,
      }),
    )

    expect(result.error).toHaveProperty('code')
  })
})
