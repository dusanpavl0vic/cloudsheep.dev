import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { ThemeMode } from '@/constants/preferences'

import { initialState } from './initialState'

export const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    setTheme: (state, { payload }: PayloadAction<ThemeMode>) => {
      state.theme = payload
    },
    /** Vrednosti iz kolačića pri startu (StoreProvider). */
    preferencesHydrated: (state, { payload }: PayloadAction<Partial<typeof initialState>>) => ({
      ...state,
      ...payload,
    }),
  },
})

export default preferencesSlice.reducer
