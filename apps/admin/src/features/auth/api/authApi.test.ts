import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import { loggedOut, sessionEstablished } from '@/features/auth/store/auth.slice'
import { store } from '@/store'

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

const API = 'http://localhost:3000/api'

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

describe('authApi', () => {
  it('`me` vraća ulogovanog korisnika', async () => {
    server.use(http.get(`${API}/auth/me`, () => HttpResponse.json(user)))

    const result = await dispatchQuery<AuthUser>(authApi.endpoints.me.initiate(undefined))

    expect(result.data).toEqual(user)
  })

  it('`me` nosi access token iz store-a, ne iz localStorage-a', async () => {
    let seenAuth: string | null = null
    store.dispatch(sessionEstablished(session))
    server.use(
      http.get(`${API}/auth/me`, ({ request }) => {
        seenAuth = request.headers.get('authorization')
        return HttpResponse.json(user)
      }),
    )

    await dispatchQuery<AuthUser>(authApi.endpoints.me.initiate(undefined))

    expect(seenAuth).toBe(`Bearer ${session.accessToken}`)
  })

  it('`login` invalidira `Session`, pa se `me` ponovo dohvata', async () => {
    let meCalls = 0
    server.use(
      http.get(`${API}/auth/me`, () => {
        meCalls += 1
        return HttpResponse.json(user)
      }),
      http.post(`${API}/auth/login`, () => HttpResponse.json(session)),
    )

    // Pretplata mora ostati živa, inače RTKQ nema šta da ponovo dohvati
    const subscription = dispatchQuery<AuthUser>(authApi.endpoints.me.initiate(undefined))
    await subscription
    expect(meCalls).toBe(1)

    await dispatchQuery<Session>(
      authApi.endpoints.login.initiate({
        email: user.email,
        password: 'tajna123',
        rememberMe: false,
      }),
    )

    await expect.poll(() => meCalls).toBe(2)
    subscription.unsubscribe()
  })

  it('greška sa servera izlazi normalizovana', async () => {
    server.use(http.get(`${API}/auth/me`, () => HttpResponse.json({}, { status: 500 })))

    const result = await dispatchQuery<AuthUser>(authApi.endpoints.me.initiate(undefined))

    expect(result.error).toHaveProperty('code')
  })
})
