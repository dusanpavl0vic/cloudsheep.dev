'use client'

import type { ReactNode } from 'react'
import { ThemeProvider as StyledThemeProvider } from 'styled-components'

import { GlobalStyles } from '@/styles/GlobalStyles'
import { theme } from '@/styles/theme'

/** Tema je statična (vrednosti su CSS promenljive), pa se provider nikad ne rerenderuje. */
const ThemeProvider = ({ children }: { children: ReactNode }) => (
  <StyledThemeProvider theme={theme}>
    <GlobalStyles />
    {children}
  </StyledThemeProvider>
)

export default ThemeProvider
