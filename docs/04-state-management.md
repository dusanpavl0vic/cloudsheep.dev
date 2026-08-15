# 04 — Upravljanje stanjem

> Status: active | Last review: 2026-08-15

## Tri kategorije stanja — svaka ima tačno jedno mesto

| Vrsta | Gde živi | Primer |
|---|---|---|
| **Server state** | RTK Query | lista projekata, profil korisnika |
| **Globalni client state** | Redux slice | sesija, tema, jezik, modali, sidebar |
| **Lokalni UI state** | `useState`/`useReducer` | otvoren dropdown, hover indeks |

**Nikad ne kopiraj RTKQ podatke u slice.** Ako ti treba izvedena vrednost iz server podataka,
to je `selectFromResult` ili `createSelector` — ne drugi izvor istine koji odmah može da zastari.

**URL state nije Redux.** Filteri, paginacija, tab — `useSearchParams`. Vidi
[`05-routing.md`](05-routing.md).

## Pravila

1. **`createSlice` uvek.** Ručni reduceri i action konstante ne postoje.
2. **`createAsyncThunk` samo za ne-HTTP async.** Svaki HTTP poziv ide kroz RTK Query.
3. **Selektori: `createSelector` za sve što izvodi, filtrira ili mapira.**
   Inline `useSelector(s => s.x.list.filter(...))` pravi novi niz svaki render → rerender svaki put.
4. **Kolekcije: `createEntityAdapter`.** Normalizacija, `selectById`, sortiranje besplatno.
5. **Lazy registracija reducera** (`store.injectReducer`) za code-split feature-e — inače
   reducer feature-a ulazi u initial bundle iako je ruta lazy.
6. **`serializableCheck`/`immutableCheck` ON u dev, OFF u prod.**
7. **Komponenta ne zove `useAppSelector` direktno** — samo feature hook. Vidi
   [`13-hooks.md`](13-hooks.md).

## Primeri

### Slice

```ts
// features/auth/store/auth.slice.ts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type AuthState = { user: AuthUser | null; accessToken: string | null };

const initialState: AuthState = { user: null, accessToken: null };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    sessionEstablished(state, action: PayloadAction<{ user: AuthUser; accessToken: string }>) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    loggedOut() {
      return initialState;
    },
  },
});

export const { sessionEstablished, loggedOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
```

**Akcije se imenuju kao događaji u prošlom vremenu** (`sessionEstablished`), ne kao komande
(`setSession`). Slice opisuje šta se desilo, ne šta neko naređuje.

### Selektori

```ts
// features/auth/store/auth.selectors.ts
import { createSelector } from '@reduxjs/toolkit';

const selectAuth = (state: RootState) => state.auth;

export const selectCurrentUser = createSelector(selectAuth, (a) => a.user);
export const selectIsAuthenticated = createSelector(selectCurrentUser, (u) => u !== null);
export const selectAccessToken = createSelector(selectAuth, (a) => a.accessToken);
```

### Parametrizovani selektor (selector factory)

```ts
// features/projects/store/projects.selectors.ts
export const makeSelectProjectById = () =>
  createSelector(
    [selectAllProjects, (_: RootState, id: string) => id],
    (projects, id) => projects.find((p) => p.id === id) ?? null,
  );

// u hooku — jedan od tri dozvoljena useMemo slučaja (07-performance §2)
export function useProject(id: string) {
  // memo: selector factory — nova instanca po id-u, inače se cache deli i uvek promašuje
  const selectProject = useMemo(makeSelectProjectById, []);
  return useAppSelector((s) => selectProject(s, id));
}
```

### `createEntityAdapter`

```ts
const projectsAdapter = createEntityAdapter<Project>({
  sortComparer: (a, b) => b.updatedAt.localeCompare(a.updatedAt),
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState: projectsAdapter.getInitialState(),
  reducers: {
    projectsReceived: projectsAdapter.setAll,
    projectUpdated: projectsAdapter.upsertOne,
  },
});

export const { selectAll: selectAllProjects, selectById: selectProjectById } =
  projectsAdapter.getSelectors((s: RootState) => s.projects);
```

### Lazy registracija reducera

```ts
// packages/core/src/store/createStore.ts — injectReducer
store.injectReducer('projects', projectsReducer);

// features/projects/index.ts — poziva se iz route lazy modula
```

## Anti-patterns

| ❌ | Zašto | ✅ |
|---|---|---|
| `useEffect(() => setFiltered(items.filter(...)), [items])` | derivirani state, dupli izvor istine | izračunaj tokom rendera |
| kopiranje `data` iz RTKQ u slice | podatak odmah zastari | čitaj iz RTKQ hooka |
| `useSelector(s => s.list.filter(f))` | nova referenca svaki render | `createSelector` |
| `createAsyncThunk` za `GET /users` | RTKQ to radi bolje, sa cache-om | `useGetUsersQuery` |
| filteri/paginacija u Redux-u | URL prestaje da bude deljiv | `useSearchParams` |
| `useState` za nešto što treba dvema komponentama daleko | prop drilling ili duplikat | slice + feature hook |
| slice sa 12 polja | nije jedan domen | podeli po domenima |

```ts
// ❌ komponenta zna za Redux
function UserMenu() {
  const user = useSelector((s: RootState) => s.auth.user);
  const dispatch = useDispatch();
  …
}

// ✅ komponenta zna samo za hook
function UserMenu() {
  const { user, logout } = useAuth();
  …
}
```

## Checklist

- [ ] Novi podatak je svrstan u tačno jednu od tri kategorije
- [ ] Ništa iz RTKQ nije prekopirano u slice
- [ ] Svaki izvodeći selektor je `createSelector`
- [ ] Kolekcija koristi `createEntityAdapter`
- [ ] Feature koji je lazy ima i lazy reducer (`injectReducer`)
- [ ] Nijedna komponenta ne zove `useAppSelector`/`useAppDispatch` direktno
- [ ] Akcije su imenovane kao događaji, ne komande
- [ ] Reducer i selektori imaju testove ([`12-testing.md`](12-testing.md))
