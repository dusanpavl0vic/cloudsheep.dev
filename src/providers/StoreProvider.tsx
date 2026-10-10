'use client'

import { useState, type ReactNode } from 'react'
import { Provider } from 'react-redux'

import type { ThemeMode } from '@/constants/preferences'
import { makeStore } from '@/store'
import { initialState as preferencesInitialState } from '@/store/slices/preferences/reducer/initialState'

interface StoreProviderProps {
  children: ReactNode
  /** Tema iz kolačića — server je zna pre prvog rendera. */
  theme: ThemeMode | null
}

/** Jedan store po instanci stabla — nikad deljen između zahteva (docs/04-state-management.md §1). */
const StoreProvider = ({ children, theme }: StoreProviderProps) => {
  const [store] = useState(() => makeStore({ preferences: { ...preferencesInitialState, theme } }))

  return <Provider store={store}>{children}</Provider>
}

export default StoreProvider
