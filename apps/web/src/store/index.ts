import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'

import { createStore } from '@app/core'

import { applyTheme, themeReducer, themeSet, themeToggled } from './slices/themeSlice'

/**
 * Side-effect promene teme (DOM atribut + localStorage) ide kroz listener middleware,
 * ne kroz `useEffect` — tema se menja iz akcije, pa reakcija pripada store sloju
 * (docs/07-performance.md §3, docs/08-styling-ui.md).
 */
const themeListener = createListenerMiddleware()

themeListener.startListening({
  matcher: isAnyOf(themeToggled, themeSet),
  effect: (_action, listenerApi) => {
    applyTheme((listenerApi.getState() as RootState).theme.theme)
  },
})

/**
 * RTK Query namerno NIJE registrovan: `apps/web` nema nijedan endpoint, a `baseApi`
 * bi uneo ~25 KB u bundle bez ijednog poziva. Uključuje se uz prvi endpoint —
 * `apiMiddleware: [baseApi.middleware]` i reducer kroz `injectReducer`.
 */
export const store = createStore({
  reducers: { theme: themeReducer },
  middleware: [themeListener.middleware],
  devMode: import.meta.env.DEV,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
