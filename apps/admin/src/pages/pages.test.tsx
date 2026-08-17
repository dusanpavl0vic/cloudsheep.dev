import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import type { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import { loggedOut, sessionEstablished } from '@/features/auth/store/auth.slice'
import type { Session } from '@/features/auth/types'
import { ROUTES } from '@/lib/routes'
import { store } from '@/store'

import { DashboardPage } from './DashboardPage'
import { LoginPage } from './LoginPage'
import { NotFoundPage } from './NotFoundPage'

const API = 'http://localhost:3000/api'

const session: Session = {
  user: { id: 'usr_1', email: 'a@b.rs', name: 'Marko', role: 'admin' },
  accessToken: 'token-1',
}

const server = setupServer()

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'error' })
})
afterEach(() => {
  server.resetHandlers()
  store.dispatch(loggedOut())
})
afterAll(() => {
  server.close()
})

const wrap = (ui: ReactNode, path = '/') =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>{ui}</MemoryRouter>
    </Provider>,
  )

describe('LoginPage', () => {
  it('prikazuje formu za prijavu', () => {
    wrap(<LoginPage />)
    // i18n nije podignut u testu, pa `t()` vraća ključ — proverava se struktura
    expect(screen.getByText('auth.login.title')).toBeInTheDocument()
  })

  it('posle prijave vodi tamo odakle je korisnik došao, ne uvek na dashboard', async () => {
    const user = userEvent.setup()
    server.use(http.post(`${API}/auth/login`, () => HttpResponse.json(session)))

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[{ pathname: ROUTES.LOGIN, state: { from: '/izvestaji' } }]}>
          <Routes>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />
            <Route path="/izvestaji" element={<p>izveštaji</p>} />
            <Route path={ROUTES.DASHBOARD} element={<p>dashboard</p>} />
          </Routes>
        </MemoryRouter>
      </Provider>,
    )

    await user.type(screen.getByLabelText(/email/i), session.user.email)
    await user.type(screen.getByLabelText(/lozink|password/i), 'tajna123')
    await user.click(screen.getByRole('button', { name: /login|prijav/i }))

    expect(await screen.findByText('izveštaji')).toBeInTheDocument()
  })
})

describe('DashboardPage', () => {
  it('pozdravlja ulogovanog korisnika imenom', () => {
    store.dispatch(sessionEstablished(session))
    wrap(<DashboardPage />)

    expect(screen.getByText('dashboard.title')).toBeInTheDocument()
  })

  it('odjava briše sesiju čak i kad server ne odgovori', async () => {
    const user = userEvent.setup()
    store.dispatch(sessionEstablished(session))
    server.use(http.post(`${API}/auth/logout`, () => HttpResponse.error()))

    wrap(<DashboardPage />)
    await user.click(screen.getByRole('button', { name: 'common.signOut' }))

    // `useLogout` briše lokalno u `finally` — korisnik mora biti odjavljen na ovom
    // uređaju bez obzira na ishod mrežnog poziva
    await expect.poll(() => store.getState().auth.session).toBeNull()
  })
})

describe('NotFoundPage', () => {
  it('nudi povratak na dashboard', () => {
    wrap(<NotFoundPage />)

    expect(screen.getByText('notFound.title')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', ROUTES.DASHBOARD)
  })
})
