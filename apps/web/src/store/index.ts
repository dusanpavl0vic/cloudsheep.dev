import { configureStore, createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'

import { applyTheme, themeReducer, themeSet, themeToggled } from './slices/themeSlice'

// Side-effect promene teme (DOM atribut + localStorage) — listener middleware umesto useEffect-a
const themeListener = createListenerMiddleware()
themeListener.startListening({
  matcher: isAnyOf(themeToggled, themeSet),
  effect: (_action, listenerApi) => {
    applyTheme((listenerApi.getState() as RootState).theme.theme)
  },
})

// RTK Query namerno NIJE uključen dok ne postoji prvi endpoint — inače bi ~25 KB
// koda ušlo u bundle bez ijednog poziva. Uključivanje kada zatreba (PROJECT_GUIDE.md 6):
//   reducer:    [baseApi.reducerPath]: baseApi.reducer
//   middleware: .concat(baseApi.middleware)
export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().prepend(themeListener.middleware),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
