import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import { STORAGE_KEYS } from '@/lib/storageKeys'
import { browserStorage, createStorage } from '@app/utils'

export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
} as const

export type Theme = (typeof THEMES)[keyof typeof THEMES]

const isTheme = (value: unknown): value is Theme => value === THEMES.LIGHT || value === THEMES.DARK

/**
 * Storage ide kroz `createStorage`, ne kroz goli `localStorage`: zastareo ili pokvaren
 * unos se tretira kao odsutan umesto da obori app, a Safari private mod ne baca
 * pri upisu (docs/14-helpers-utils.md).
 *
 * Provera je ručna, ne `z.enum`. Zod je ovde bio jedini razlog zbog kog je cela biblioteka
 * (15.5 KB gzip) ulazila u **početno učitavanje** — desetina budžeta, zarad poređenja dva
 * stringa. Na `/contact` ruti zod i dalje radi svoj posao, ali se tamo i učitava.
 */
const themeStorage = createStorage(
  STORAGE_KEYS.THEME,
  { safeParse: (value) => (isTheme(value) ? { success: true, data: value } : { success: false }) },
  browserStorage(),
)

const getInitialTheme = (): Theme =>
  themeStorage.get() ??
  (window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT)

export const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme
  themeStorage.set(theme)
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
