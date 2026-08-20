import { render, screen, waitFor } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import type { PropsWithChildren } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest'

import { RequireAuth } from '@/routes/RequireAuth'
import { SessionGate } from '@/routes/SessionGate'
import { baseApi, store } from '@/store'
import { createI18n } from '@app/i18n'

import { loggedOut, selectCurrentUser } from '../store/auth.slice'
import type { Session } from '../types'

const API = 'http://localhost:3000'

const session: Session = {
  user: { id: 'usr_1', email: 'a@b.rs', name: 'Marko', role: 'admin' },
  accessToken: 'token-1',
}

const server = setupServer()

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})
/*
 * Keš se čisti PRE testa, ne posle.
 *
 * Posle bi `resetApiState()` zatekao komponente iz prethodnog testa još montirane, pa bi
 * one odmah ponovo dohvatile — sa handler-ima koji su u međuvremenu skinuti.
 */
beforeEach(() => {
  store.dispatch(loggedOut())
  store.dispatch(baseApi.util.resetApiState())
})
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => {
  server.close()
})

const i18n = createI18n({ resources: {}, storageKey: 'test.lang', lng: 'cimode' })

function Wrapper({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
    </Provider>
  )
}

/** Isti raspored kao pravi router: gate iznad, guard ispod njega. */
const renderApp = () =>
  render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route element={<SessionGate />}>
          <Route path="/login" element={<p>strana za prijavu</p>} />
          <Route element={<RequireAuth />}>
            <Route path="/" element={<p>tabla</p>} />
          </Route>
        </Route>
      </Routes>
    </MemoryRouter>,
    { wrapper: Wrapper },
  )

describe('obnova sesije pri pokretanju', () => {
  /*
   * Ovo je regresija zbog koje je test i napisan: access token živi u memoriji i nestane sa
   * osvežavanjem stranice, pa je panel pri SVAKOM ulasku tražio lozinku — iako refresh
   * cookie postoji. Obnova se nikad nije ožičila.
   */
  it('sa važećim refresh cookie-jem ne traži prijavu', async () => {
    server.use(http.post(`${API}/auth/refresh`, () => HttpResponse.json(session)))

    renderApp()

    expect(await screen.findByText('tabla')).toBeInTheDocument()
    expect(screen.queryByText('strana za prijavu')).not.toBeInTheDocument()
    expect(selectCurrentUser(store.getState())).toEqual(session.user)
  })

  it('bez cookie-ja vodi na prijavu, bez pada', async () => {
    server.use(
      http.post(`${API}/auth/refresh`, () =>
        HttpResponse.json({ messageKey: 'errors.unauthorized' }, { status: 401 }),
      ),
    )

    renderApp()

    expect(await screen.findByText('strana za prijavu')).toBeInTheDocument()
    expect(selectCurrentUser(store.getState())).toBeNull()
  })

  /*
   * Bez čekanja bi guard pročitao prazan Redux i preusmerio pre nego što odgovor stigne —
   * tačno greška koju gate ispravlja. Zato tabla NE sme da se pojavi odmah.
   */
  it('dok obnova traje ne prikazuje ni tablu ni prijavu', async () => {
    server.use(
      http.post(`${API}/auth/refresh`, async () => {
        await new Promise((resolve) => setTimeout(resolve, 40))
        return HttpResponse.json(session)
      }),
    )

    renderApp()

    expect(screen.queryByText('tabla')).not.toBeInTheDocument()
    expect(screen.queryByText('strana za prijavu')).not.toBeInTheDocument()
    expect(screen.getByRole('status')).toBeInTheDocument()

    await waitFor(() => {
      expect(screen.getByText('tabla')).toBeInTheDocument()
    })
  })
})
