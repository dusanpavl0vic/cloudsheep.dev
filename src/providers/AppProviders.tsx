import type { ReactNode } from 'react'

import type { ThemeMode } from '@/constants/preferences'

import I18nProvider from './I18nProvider'
import StoreProvider from './StoreProvider'

interface AppProvidersProps {
  children: ReactNode
  theme: ThemeMode | null
}

/**
 * Redosled kao u šablonu (§11). Stilovi nemaju provider: next-yak ih izvlači u build-u, a tema
 * je `data-theme` + CSS promenljive (ADR 0015).
 */
const AppProviders = ({ children, theme }: AppProvidersProps) => (
  <StoreProvider theme={theme}>
    <I18nProvider>{children}</I18nProvider>
  </StoreProvider>
)

export default AppProviders
