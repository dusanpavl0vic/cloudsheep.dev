import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import type { PropsWithChildren } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { MemoryRouter } from 'react-router'
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest'

import { loggedOut } from '@/features/auth/store/auth.slice'
import { store } from '@/store'
import { createI18n } from '@app/i18n'

import { LoginForm } from '../components/LoginForm'
import { selectCurrentUser, selectIsAuthenticated } from '../store/auth.slice'
import type { Session } from '../types'

const API = 'http://localhost:3000/api'

const session: Session = {
  user: { id: 'usr_1', email: 'a@b.rs', name: 'Marko', role: 'admin' },
  accessToken: 'token-1',
}

// MSW presreće na MREŽNOM nivou — test prolazi kroz pravi baseQuery,
// prave tagove i pravu normalizaciju grešaka (docs/12-testing.md)
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

const i18n = createI18n({ resources: {}, storageKey: 'test.lang', lng: 'cimode' })

function Wrapper({ children }: PropsWithChildren) {
  return (
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>{children}</MemoryRouter>
      </I18nextProvider>
    </Provider>
  )
}

const renderForm = () => ({
  user: userEvent.setup(),
  ...render(<LoginForm />, { wrapper: Wrapper }),
})

describe('prijava — ceo tok kroz pravi store i pravu mrežu', () => {
  it('uspešna prijava puni sesiju u store-u', async () => {
    server.use(http.post(`${API}/auth/login`, () => HttpResponse.json(session)))

    const { user } = renderForm()

    await user.type(screen.getByLabelText('auth.login.email'), 'a@b.rs')
    await user.type(screen.getByLabelText('auth.login.password'), 'lozinka123')
    await user.click(screen.getByRole('button', { name: 'auth.login.submit' }))

    await waitFor(() => {
      expect(selectIsAuthenticated(store.getState())).toBe(true)
    })
    expect(selectCurrentUser(store.getState())?.name).toBe('Marko')
  })

  it('pogrešni podaci prijavljuju grešku NA POLJU, ne u toast-u', async () => {
    server.use(
      http.post(`${API}/auth/login`, () => HttpResponse.json({ message: 'nope' }, { status: 401 })),
    )

    const { user } = renderForm()

    await user.type(screen.getByLabelText('auth.login.email'), 'a@b.rs')
    await user.type(screen.getByLabelText('auth.login.password'), 'lozinka123')
    await user.click(screen.getByRole('button', { name: 'auth.login.submit' }))

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('auth.errors.invalidCredentials')
    expect(selectIsAuthenticated(store.getState())).toBe(false)
  })

  it('validacija se izvršava pre mreže — prazna forma ne šalje zahtev', async () => {
    // Nema http handlera: svaki zahtev bi oborio test kroz onUnhandledRequest: 'error'
    const { user } = renderForm()

    await user.click(screen.getByRole('button', { name: 'auth.login.submit' }))

    expect(await screen.findAllByRole('alert')).toHaveLength(2)
    expect(selectIsAuthenticated(store.getState())).toBe(false)
  })

  it('prekratka lozinka daje i18n ključ, ne tekst', async () => {
    const { user } = renderForm()

    await user.type(screen.getByLabelText('auth.login.email'), 'a@b.rs')
    await user.type(screen.getByLabelText('auth.login.password'), 'kratka')
    await user.click(screen.getByRole('button', { name: 'auth.login.submit' }))

    expect(await screen.findByText('auth.errors.passwordTooShort')).toBeInTheDocument()
  })

  it('polja su povezana sa labelama — getByLabelText bi pao da nisu', () => {
    renderForm()

    expect(screen.getByLabelText('auth.login.email')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('auth.login.password')).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText('auth.login.rememberMe')).toHaveAttribute('type', 'checkbox')
  })

  it('greška polja nosi aria-invalid i aria-describedby', async () => {
    const { user } = renderForm()

    await user.type(screen.getByLabelText('auth.login.email'), 'nije-email')
    await user.click(screen.getByRole('button', { name: 'auth.login.submit' }))

    const email = screen.getByLabelText('auth.login.email')
    await waitFor(() => {
      expect(email).toHaveAttribute('aria-invalid', 'true')
    })
    expect(email).toHaveAttribute('aria-describedby')
  })
})
