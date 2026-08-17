import { configureStore } from '@reduxjs/toolkit'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createBaseApi } from './createBaseApi'

/**
 * `fetchBaseQuery` ide preko globalnog `fetch`, pa se mreža glumi tu — bez MSW-a, koji
 * `packages/core` nema u zavisnostima i koji bi ovde bio teži nego sam predmet testa.
 *
 * Svaki odgovor se opisuje kao `{ status, body }`, a redosled poziva se pamti, jer je
 * poenta većine testova **koliko puta** i **kojim redom** se ide na mrežu.
 */
interface Reply {
  status: number
  body?: unknown
}

let replies: Reply[] = []
let calls: { url: string; method: string; auth: string | null }[] = []

const respond = (...queued: Reply[]) => {
  replies = [...queued]
}

const makeStore = (token: string | null, onExpired = vi.fn()) => {
  const api = createBaseApi({
    baseUrl: 'https://api.test',
    selectToken: () => token,
    onRefreshed: (data) => ({ type: 'auth/refreshed', payload: data }),
    onSessionExpired: () => {
      onExpired()
      return { type: 'auth/expired' }
    },
  })

  const store = configureStore({
    reducer: { [api.reducerPath]: api.reducer },
    middleware: (getDefault) => getDefault().concat(api.middleware),
  })

  // Jedan endpoint je dovoljan da se pokrene ceo `baseQueryWithReauth`
  const injected = api.injectEndpoints({
    endpoints: (build) => ({ me: build.query<unknown, undefined>({ query: () => '/me' }) }),
  })

  return { store, api: injected }
}

beforeEach(() => {
  replies = []
  calls = []
  vi.stubGlobal(
    'fetch',
    vi.fn((input: string | URL | Request, init?: RequestInit) => {
      // `fetchBaseQuery` šalje gotov `Request`, pa metoda i zaglavlja stoje NA NJEMU, a
      // `init` ostaje prazan. Prva verzija mocka je čitala samo `init` i zato je videla
      // GET bez tokena na svakom pozivu — mock je lagao, ne kod.
      if (input instanceof Request) {
        calls.push({
          url: input.url,
          method: input.method,
          auth: input.headers.get('authorization'),
        })
      } else {
        calls.push({
          url: input instanceof URL ? input.href : input,
          method: init?.method ?? 'GET',
          auth: new Headers(init?.headers ?? {}).get('authorization'),
        })
      }

      const next = replies.shift() ?? { status: 200, body: {} }
      return Promise.resolve(
        new Response(JSON.stringify(next.body ?? {}), {
          status: next.status,
          headers: { 'content-type': 'application/json' },
        }),
      )
    }),
  )
})

afterEach(() => {
  vi.unstubAllGlobals()
})

/** Pokrene `me` upit i sačeka ishod. */
const run = (store: ReturnType<typeof makeStore>) => {
  const thunk = (store.api.endpoints as never as { me: { initiate: () => never } }).me.initiate()
  return store.store.dispatch(thunk)
}

describe('createBaseApi', () => {
  it('kači Bearer token na zahtev', async () => {
    const s = makeStore('t0ken')
    respond({ status: 200, body: { ok: true } })

    await run(s)

    expect(calls[0]?.auth).toBe('Bearer t0ken')
  })

  it('bez tokena ne šalje authorization zaglavlje', async () => {
    const s = makeStore(null)
    respond({ status: 200, body: { ok: true } })

    await run(s)

    expect(calls[0]?.auth).toBeNull()
  })

  it('na 401 obnovi sesiju pa ponovi originalni zahtev', async () => {
    const s = makeStore('stari')
    respond(
      { status: 401 },
      { status: 200, body: { token: 'novi' } }, // refresh
      { status: 200, body: { ok: true } }, // ponovljeni zahtev
    )

    await run(s)

    expect(calls).toHaveLength(3)
    expect(calls[1]?.url).toContain('/auth/refresh')
    expect(calls[1]?.method).toBe('POST')
  })

  it('kad refresh padne, javi da je sesija istekla i NE ponavlja zahtev', async () => {
    const onExpired = vi.fn()
    const s = makeStore('mrtav', onExpired)
    respond({ status: 401 }, { status: 401 })

    await run(s)

    expect(onExpired).toHaveBeenCalledTimes(1)
    // Originalni zahtev + refresh; trećeg nema jer nema čime da se ponovi
    expect(calls).toHaveLength(2)
  })

  it('uspešan odgovor prolazi kao podatak', async () => {
    const s = makeStore('t')
    respond({ status: 200, body: { ime: 'CloudSheep' } })

    const result = await run(s)

    expect((result as { data?: unknown }).data).toEqual({ ime: 'CloudSheep' })
  })

  it('greška izlazi normalizovana, ne kao sirov RTKQ oblik', async () => {
    const s = makeStore('t')
    respond({ status: 500, body: { message: 'boom' } })

    const result = await run(s)
    const error = (result as { error?: Record<string, unknown> }).error

    // `normalizeError` pravi AppError — sirov RTKQ ima `status`, naš ima `code`
    expect(error).toBeDefined()
    expect(error).toHaveProperty('code')
  })

  it('dva paralelna 401 pokreću SAMO jednu obnovu — to je posao mutex-a', async () => {
    const s = makeStore('stari')
    respond(
      { status: 401 },
      { status: 401 },
      { status: 200, body: { token: 'novi' } },
      { status: 200, body: { ok: true } },
      { status: 200, body: { ok: true } },
    )

    await Promise.all([run(s), run(s)])

    const refreshes = calls.filter((c) => c.url.includes('/auth/refresh'))
    expect(refreshes).toHaveLength(1)
  })
})
