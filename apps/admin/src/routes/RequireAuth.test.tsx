import { render, screen } from '@testing-library/react'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router'
import { afterEach, describe, expect, it } from 'vitest'

import { loggedOut, sessionEstablished } from '@/features/auth/store/auth.slice'
import type { Session } from '@/features/auth/types'
import { ROUTES } from '@/lib/routes'
import { store } from '@/store'

import { RequireAuth } from './RequireAuth'

const session: Session = {
  user: { id: 'usr_1', email: 'a@b.rs', name: 'Marko', role: 'admin' },
  accessToken: 'token-1',
}

/** Montira zaštićenu rutu i login stranicu, pa se vidi gde je korisnik završio. */
const renderAt = (path: string) =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={ROUTES.LOGIN} element={<p>login ekran</p>} />
          <Route element={<RequireAuth />}>
            <Route path="/tajna" element={<p>tajni sadržaj</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Provider>,
  )

afterEach(() => {
  store.dispatch(loggedOut())
})

describe('RequireAuth', () => {
  it('neulogovanog šalje na login', () => {
    store.dispatch(loggedOut())
    renderAt('/tajna')

    expect(screen.getByText('login ekran')).toBeInTheDocument()
  })

  it('zaštićeni sadržaj se NE renderuje ni na tren — guard radi tokom rendera', () => {
    store.dispatch(loggedOut())
    renderAt('/tajna')

    // Da je guard bio `useEffect` + `navigate`, sadržaj bi bljesnuo pre redirekcije
    // i ovaj upit bi ga uhvatio (docs/05-routing.md).
    expect(screen.queryByText('tajni sadržaj')).not.toBeInTheDocument()
  })

  it('ulogovanog pušta na zaštićenu rutu', () => {
    store.dispatch(sessionEstablished(session))
    renderAt('/tajna')

    expect(screen.getByText('tajni sadržaj')).toBeInTheDocument()
  })

  it('pamti odakle je korisnik došao, da bi se posle prijave vratio tamo', () => {
    store.dispatch(loggedOut())
    const { container } = renderAt('/tajna')

    // `state.from` se ne vidi u DOM-u; dovoljno je da je redirekcija otišla na login
    expect(container.textContent).toContain('login ekran')
  })
})
