import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Session } from '../types'

export interface AuthState {
  session: Session | null
}

const initialState: AuthState = { session: null }

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Akcije su imenovane kao DOGAĐAJI u prošlom vremenu, ne komande (docs/04)
    sessionEstablished: (state, action: PayloadAction<Session>) => {
      state.session = action.payload
    },
    sessionRefreshed: (state, action: PayloadAction<Session>) => {
      state.session = action.payload
    },
    loggedOut: () => initialState,
  },
  selectors: {
    selectSession: (state) => state.session,
    selectCurrentUser: (state) => state.session?.user ?? null,
    selectAccessToken: (state) => state.session?.accessToken ?? null,
    selectIsAuthenticated: (state) => state.session !== null,
  },
})

export const { sessionEstablished, sessionRefreshed, loggedOut } = authSlice.actions
export const { selectSession, selectCurrentUser, selectAccessToken, selectIsAuthenticated } =
  authSlice.selectors
export const authReducer = authSlice.reducer
