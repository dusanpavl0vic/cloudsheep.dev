import { render, type RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { setupServer } from 'msw/node'
import type { PropsWithChildren, ReactElement } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router'

import { ModalRoot } from '@/providers/ModalRoot'
import { store } from '@/store'
import { createI18n } from '@app/i18n'

/**
 * Deljeni okvir za integracione testove admin panela.
 *
 * Postoji zato što su feature-i imali identičan blok od trideset linija: MSW server,
 * `cimode` i18n, `Provider`, `MemoryRouter`, `ModalRoot`. Kad se to kopira, ispravka u
 * jednom (npr. redosled brisanja keša) ne stigne do ostalih.
 */
export const API = 'http://localhost:3000'

export const server = setupServer()

const i18n = createI18n({ resources: {}, storageKey: 'test.lang', lng: 'cimode' })

interface RenderOptions {
  /**
   * Šablon rute i početna adresa — za stranice koje čitaju `useParams`.
   *
   * Router je UVEK ovde, nikad u samom testu: dva `<Router>` jedan u drugom React Router
   * odbija sa „You cannot render a <Router> inside another <Router>".
   */
  path?: string
  entry?: string
}

function makeWrapper({ path, entry }: RenderOptions) {
  return function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={[entry ?? '/']}>
            {path ? <Routes>{<Route path={path} element={children} />}</Routes> : children}
            {/* Modali idu kroz ModalRoot, kao u pravoj app-i */}
            <ModalRoot />
          </MemoryRouter>
        </I18nextProvider>
      </Provider>
    )
  }
}

/**
 * Povratni tip je napisan eksplicitno, ne izveden.
 *
 * `RenderResult` vuče tipove iz `pretty-format`, koji je tranzitivna zavisnost; TS onda
 * odbija da imenuje izvedeni tip (TS2883, „cannot be named without a reference to…").
 */
interface RenderWithApp {
  user: ReturnType<typeof userEvent.setup>
  container: HTMLElement
  unmount: () => void
  rerender: RenderResult['rerender']
}

export const renderWithApp = (ui: ReactElement, options: RenderOptions = {}): RenderWithApp => {
  const { container, unmount, rerender } = render(ui, { wrapper: makeWrapper(options) })

  return { user: userEvent.setup(), container, unmount, rerender }
}
