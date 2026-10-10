import { configureStore, createDynamicMiddleware } from '@reduxjs/toolkit'

import { preferencesPersistenceListener } from './listeners/preferencesPersistence'
import { rootReducer } from './rootReducer'

/**
 * Middleware koji se dodaje kad zatreba — RTK Query ga koristi da ne bi bio u početnom
 * JS-u javnih stranica. Jedna instanca za sve store-ove: dodati middleware se primenjuje
 * posebno za svaki store, pa je bezbedno i pri SSR-u.
 */
export const dynamicMiddleware = createDynamicMiddleware()

/**
 * Pravi NOV store. U Next-u se ne izvozi jedan globalni store kao u SPA šablonu: server
 * renderuje više zahteva istovremeno, pa bi deljeni store mešao stanje posetilaca.
 * `StoreProvider` pravi po jedan za svaku instancu stabla (docs/04-state-management.md §1).
 */
export const makeStore = (preloadedState?: Partial<ReturnType<typeof rootReducer>>) =>
  configureStore({
    reducer: rootReducer,
    ...(preloadedState ? { preloadedState } : {}),
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware()
        .prepend(preferencesPersistenceListener.middleware)
        .concat(dynamicMiddleware.middleware),
  })

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = AppStore['dispatch']
