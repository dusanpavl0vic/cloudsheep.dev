import type { ReactNode } from 'react'

import type { ThemeMode } from '@/constants/preferences'

import I18nProvider from './I18nProvider'
import StoreProvider from './StoreProvider'
import StyledRegistry from './StyledRegistry'
import ThemeProvider from './ThemeProvider'

interface AppProvidersProps {
  children: ReactNode
  theme: ThemeMode | null
}

/** Redosled kao u šablonu (§11), sa SSR registry-jem styled-components-a spolja. */
const AppProviders = ({ children, theme }: AppProvidersProps) => (
  <StyledRegistry>
    <StoreProvider theme={theme}>
      <I18nProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </I18nProvider>
    </StoreProvider>
  </StyledRegistry>
)

export default AppProviders
