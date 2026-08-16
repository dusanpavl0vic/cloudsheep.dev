import {
  combineReducers,
  configureStore,
  type Middleware,
  type Reducer,
  type ReducersMapObject,
  type StateFromReducersMapObject,
} from '@reduxjs/toolkit'

import { modalReducer } from '../modals/modal.slice'

interface CreateStoreOptions<TReducers extends ReducersMapObject> {
  /** Reduceri app-e; modal reducer se dodaje automatski */
  reducers: TReducers
  /** Dodatni middleware — npr. listener middleware za temu */
  middleware?: Middleware[]
  /** RTK Query middleware, ako app koristi baseApi */
  apiMiddleware?: Middleware[]
  preloadedState?: Record<string, unknown>
  /**
   * Uključuje `serializableCheck`, `immutableCheck` i devtools.
   *
   * Prosleđuje ga app kao `import.meta.env.DEV`. Paket namerno ne poseže za globalnim
   * `process` ni `import.meta` — ne sme da zna u kom okruženju radi (isto pravilo po kom
   * `isExpired` prima sat, docs/14).
   *
   * Podrazumevano `true`: zaboravljena zastavica se vidi kao trošak u produkciji,
   * dok bi obrnut podrazumevani tiho ugasio provere u razvoju.
   */
  devMode?: boolean
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
export function createStore<TReducers extends ReducersMapObject>({
  reducers,
  middleware = [],
  apiMiddleware = [],
  preloadedState,
  devMode = true,
}: CreateStoreOptions<TReducers>) {
  // Tip stanja se izvodi iz prosleđenih reducera, pa RootState u app-i nije `any`.
  // Lazy reduceri se ne mogu statički otipkati — feature koji ih uvodi tipizira svoj deo sam.
  type StaticState = StateFromReducersMapObject<TReducers & { modal: typeof modalReducer }>

  const staticReducers: ReducersMapObject = { ...reducers, modal: modalReducer }
  const asyncReducers = new Map<string, Reducer>()

  const rootReducer = (): Reducer =>
    combineReducers({ ...staticReducers, ...Object.fromEntries(asyncReducers) })

  const store = configureStore({
    reducer: rootReducer(),
    ...(preloadedState === undefined ? {} : { preloadedState }),
    devTools: devMode,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: devMode,
        immutableCheck: devMode,
      })
        .prepend(...middleware)
        .concat(...apiMiddleware),
  })

  // `configureStore` ne može da izvede tip iz dinamičke mape reducera, pa se tip stanja
  // vraća ovde. Lazy reduceri nisu u njemu — feature koji ih uvodi tipizira svoj deo sam.
  const typedStore = store as Omit<typeof store, 'getState'> & { getState: () => StaticState }

  return Object.assign(typedStore, {
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

export type AppStore = ReturnType<typeof createStore<ReducersMapObject>>
export type AppDispatch = AppStore['dispatch']
