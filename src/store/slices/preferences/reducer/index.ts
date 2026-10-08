import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Locale } from '@/constants/i18n'
import type { ThemeMode } from '@/constants/preferences'

import { initialState } from './initialState'

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, { payload }: PayloadAction<ThemeMode>) => {
      state.theme = payload
    },
    setAdminLocale: (state, { payload }: PayloadAction<Locale>) => {
      state.adminLocale = payload
    },
    /** Vrednosti iz kolačića / localStorage-a pri startu (SessionProvider, StoreProvider). */
    preferencesHydrated: (state, { payload }: PayloadAction<Partial<typeof initialState>>) => ({
      ...state,
      ...payload,
    }),
  },
})

export default preferencesSlice.reducer
