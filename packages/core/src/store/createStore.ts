import {
  combineReducers,
  configureStore,
  type Middleware,
  type Reducer,
  type ReducersMapObject,
} from '@reduxjs/toolkit'

import { modalReducer } from '../modals/modal.slice'

interface CreateStoreOptions {
  /** Reduceri app-e; modal reducer se dodaje automatski */
  reducers: ReducersMapObject
  /** Dodatni middleware — npr. listener middleware za temu */
  middleware?: Middleware[]
  /** RTK Query middleware, ako app koristi baseApi */
  apiMiddleware?: Middleware[]
  preloadedState?: Record<string, unknown>
}

/**
 * Store factory sa podrškom za lazy reducere.
 *
 * `injectReducer` postoji da bi feature koji je code-split imao i **reducer** koji je
 * code-split. Bez toga je ruta lazy, ali njen reducer svejedno ulazi u initial bundle
 * (docs/04-state-management.md).
 *
 * `serializableCheck`/`immutableCheck` su uključene u dev, isključene u prod — provere
 * su korisne dok se piše, ali u produkciji koštaju na svakom dispatch-u.
 */
export function createStore({
  reducers,
  middleware = [],
  apiMiddleware = [],
  preloadedState,
}: CreateStoreOptions) {
  const staticReducers: ReducersMapObject = { ...reducers, modal: modalReducer }
  const asyncReducers = new Map<string, Reducer>()

  const rootReducer = (): Reducer =>
    combineReducers({ ...staticReducers, ...Object.fromEntries(asyncReducers) })

  const isDev = process.env.NODE_ENV !== 'production'

  const store = configureStore({
    reducer: rootReducer(),
    ...(preloadedState === undefined ? {} : { preloadedState }),
    devTools: isDev,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: isDev,
        immutableCheck: isDev,
      })
        .prepend(...middleware)
        .concat(...apiMiddleware),
  })

  return Object.assign(store, {
    /** Dodaje reducer u letu; ponovljeni poziv sa istim ključem je no-op. */
    injectReducer(key: string, reducer: Reducer): void {
      if (key in staticReducers || asyncReducers.has(key)) return
      asyncReducers.set(key, reducer)
      store.replaceReducer(rootReducer())
    },

    /** Da li je reducer već registrovan — koristi se u testovima. */
    hasReducer(key: string): boolean {
      return key in staticReducers || asyncReducers.has(key)
    },
  })
}

export type AppStore = ReturnType<typeof createStore>
export type AppDispatch = AppStore['dispatch']
