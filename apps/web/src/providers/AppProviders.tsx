import type { ReactNode } from 'react'
import { I18nextProvider } from 'react-i18next'
import { Provider } from 'react-redux'

import { i18n } from '@/i18n'
import { store } from '@/store'

interface AppProvidersProps {
  children: ReactNode
}

/**
 * Svi provideri na jednom mestu.
 *
 * i18n ide kroz provider, ne kroz globalni import: `@app/i18n` pravi instancu preko
 * `createInstance`, pa side-effect import ne bi povezao React stablo sa njom.
 */
export const AppProviders = ({ children }: AppProvidersProps) => (
  <Provider store={store}>
    <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
  </Provider>
)
