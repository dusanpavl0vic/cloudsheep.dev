import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { STORAGE_KEYS } from '@/constants/storageKeys'

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const

export type Theme = (typeof THEMES)[keyof typeof THEMES]

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME)
  if (stored === THEMES.LIGHT || stored === THEMES.DARK) return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT
}

export const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme
  localStorage.setItem(STORAGE_KEYS.THEME, theme)
}

// Izvezen jer `composite: true` traži da svaki tip u javnom potpisu bude imenljiv —
// RootState se izvodi iz store-a, pa ThemeState mora imati ime koje tsc može da referiše.
export interface ThemeState {
  theme: Theme
}

const initialState: ThemeState = {
  theme: getInitialTheme(),
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    themeToggled: (state) => {
      state.theme = state.theme === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT
    },
    themeSet: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload
    },
  },
})

export const { themeToggled, themeSet } = themeSlice.actions
export const themeReducer = themeSlice.reducer
