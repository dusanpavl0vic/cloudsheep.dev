import { createSlice, type PayloadAction, type WithSlice } from '@reduxjs/toolkit'

import type { SessionResponse } from '@/types/auth'

import { initialState } from './initialState'
import { rootReducer } from '../../../rootReducer'

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /** Prijava ili obnova sesije uspela. */
    sessionStarted: (state, { payload }: PayloadAction<SessionResponse>) => {
      state.status = 'authenticated'
      state.user = payload.user
      state.accessToken = payload.accessToken
    },
    /** Obnova nije uspela ili odjava — admin ide na prijavu. */
    sessionEnded: () => ({ ...initialState, status: 'anonymous' as const }),
  },
})

declare module '../../../rootReducer' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type -- augmentation lenjih slice-ova
  export interface LazyLoadedSlices extends WithSlice<typeof authSlice> {}
}

// Ubacuje se pri prvom uvozu — javni sajt ga nikad ne učita (docs/04 §2).
rootReducer.inject(authSlice)

export default authSlice.reducer
