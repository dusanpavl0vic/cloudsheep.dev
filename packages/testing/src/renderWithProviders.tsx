import type { ReducersMapObject } from '@reduxjs/toolkit'
import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement, PropsWithChildren } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'
import { MemoryRouter, Route, Routes } from 'react-router'

import { createStore } from '@app/core'
import { createI18n } from '@app/i18n'

export interface RenderWithProvidersOptions extends Omit<RenderOptions, 'wrapper'> {
  /** Reduceri app-e; modal reducer se dodaje automatski */
  reducers?: ReducersMapObject
  preloadedState?: Record<string, unknown>
  /** Početna ruta */
  route?: string
  /** Šablon rute — potrebno kad komponenta čita `useParams` */
  path?: string
  /** Postojeći store, ako test hoće da ga deli između rendera */
  store?: ReturnType<typeof createStore>
}

export interface RenderWithProvidersResult extends RenderResult {
  store: ReturnType<typeof createStore>
  user: ReturnType<typeof userEvent.setup>
}

/**
 * Jedini način na koji se komponente renderuju u testovima (docs/12-testing.md).
 *
 * i18n je u `cimode` — `t('auth.login.title')` vraća sam ključ. Testira se ključ, ne prevod;
 * inače test pada svaki put kad copywriter promeni tekst.
 *
 * Vraća i `store` (za proveru dispatch-ovanih akcija) i `user` (već setup-ovan `user-event`),
 * pa test ne mora da ih pravi ručno.
 */
export function renderWithProviders(
  ui: ReactElement,
  {
    reducers = {},
    preloadedState,
    route = '/',
    path,
    store = createStore({
      reducers,
      ...(preloadedState === undefined ? {} : { preloadedState }),
    }),
    ...renderOptions
  }: RenderWithProvidersOptions = {},
): RenderWithProvidersResult {
  const i18n = createI18n({
    resources: {},
    storageKey: 'test.language',
    lng: 'cimode',
  })

  function Wrapper({ children }: PropsWithChildren) {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={[route]}>
            {path === undefined ? children : <Routes><Route path={path} element={children} /></Routes>}
          </MemoryRouter>
        </I18nextProvider>
      </Provider>
    )
  }

  return {
    store,
    user: userEvent.setup(),
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
  }
}
