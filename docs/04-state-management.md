# 04 — Upravljanje stanjem

> Status: active | Last review: 2026-10-08

## 1. Gde živi koje stanje

| Stanje                             | Gde                             | Primer                                           |
| ---------------------------------- | ------------------------------- | ------------------------------------------------ |
| Podaci iz baze za javnu stranicu   | server komponenta → props       | lista projekata, beleška                         |
| Podaci iz API-ja na klijentu       | RTK Query (`store/api/<domen>`) | admin liste, slobodni termini, slanje upita      |
| Globalno klijentsko stanje         | slice (`store/slices/<slice>`)  | otvoreni modali, toast-ovi, tema, sesija admin-a |
| Stanje jednog hooka/komponente     | `useState` (≤ 2)                | korak forme, otvoren akordeon                    |
| Filter, stranica, izabrana kartica | URL (`useSearchParams` u hooku) | `/projects?category=mobile`                      |

**Nikad** se RTKQ podaci ne kopiraju u slice, i nikad se filter ne drži u Redux-u.

### Store po instanci, ne globalni

Šablon (§6.1) izvozi jedan `store` za ceo SPA. U Next-u **to je greška**: server renderuje više
zahteva u istom procesu, pa bi globalni store mešao stanje posetilaca. Zato:

- `store/index.ts` izvozi samo `makeStore` i tipove;
- `providers/StoreProvider.tsx` pravi store jednom po instanci stabla
  (`useState(() => makeStore(preloaded))`) i prima temu iz kolačića kao početno stanje.

## 2. Lenjo učitani RTK Query

`rootReducer` je `combineSlices(ui, preferences).withLazyLoadedSlices<LazyLoadedSlices>()`.
`store/api/baseApi.ts` pri **prvom uvozu** radi:

```ts
rootReducer.inject(baseApi)
dynamicMiddleware.addMiddleware(baseApi.middleware)
```

Javna stranica bez forme nikad ne uveze `baseApi`, pa RTK Query (~10 KB gzip) nije u njenom
JS-u. Stranica sa formom ga dobije zajedno sa hookom forme. `createDynamicMiddleware` primenjuje
dodat middleware posebno za svaki store, pa je bezbedan i pri SSR-u.

## 3. Struktura slice-a

Tačno po šablonu §6.3:

```
store/slices/ui/
  actions/index.ts        export const { openModal, … } = uiSlice.actions
  reducer/index.ts        createSlice; export default reducer, export { uiSlice }
  reducer/initialState.ts
  selectors/index.ts      selectX = (state: RootState) => …; fabrike; createSelector
  types/index.ts
  index.ts                barrel
```

- Komponenta nikad ne čita `state.x.y` — uvek selektor, i to kroz domenski hook.
- Akcija koju API sloj mora da pošalje (npr. `sessionExpired` iz `baseQuery`) je samostalna
  (`createAction`), da ne nastane kružni import.
- Reducer sluša RTKQ endpoint kroz `builder.addMatcher(api.endpoints.x.matchFulfilled, …)`.

## 4. Slice-ovi

| Slice                      | Stanje                                   | Trajnost                                                |
| -------------------------- | ---------------------------------------- | ------------------------------------------------------- |
| `ui`                       | stek modala, toast-ovi                   | —                                                       |
| `preferences`              | `theme` (`null` = sistem)                | tema → kolačić `cs-theme`; jezik admin-a je kolačić `cs-admin-locale` (server ga čita, nije u store-u) |
| `auth` (lenjo, samo admin) | access token u memoriji, korisnik        | refresh token je httpOnly kolačić — nikad u JS-u        |

## 5. Listeners i persistence

Side efekti promena stanja idu u `store/listeners/` (`createListenerMiddleware`), a čitanje i
upis u kolačić/storage u `store/persistence/`, **uvek u try/catch**:

```ts
preferencesPersistenceListener.startListening({
  actionCreator: setTheme,
  effect: ({ payload }) => {
    applyThemeAttribute(payload) // data-theme na <html>, bez rerendera
    saveThemeCookie(payload) // server ga čita pri sledećem renderu
  },
})
```

## Anti-patterns

| ❌                                 | ✅                                             |
| ---------------------------------- | ---------------------------------------------- |
| `export const store = makeStore()` | `StoreProvider` pravi store po instanci        |
| `useAppSelector` u komponenti      | domenski hook vraća vrednost                   |
| `useEffect(() => { fetch(…) })`    | RTKQ hook ili serverska komponenta             |
| filter u slice-u                   | `useSearchParams` u hooku                      |
| `localStorage.setItem('token', …)` | refresh u httpOnly kolačiću, access u memoriji |
