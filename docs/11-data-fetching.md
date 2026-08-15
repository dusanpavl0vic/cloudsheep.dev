# 11 — Dohvatanje podataka

> Status: active | Last review: 2026-08-15

**Sav HTTP ide kroz RTK Query. `useEffect` + `fetch` ne postoji u ovom repou. Ikad.**

## Pravila

1. **Jedan `baseApi`** u `@app/core`; feature-i rade `injectEndpoints()`. Nikad drugi `createApi`.
2. **Invalidacija preko `providesTags`/`invalidatesTags`.** Ručni `refetch()` samo kad ga
   korisnik eksplicitno traži (dugme "Osveži").
3. **`transformResponse` za snake_case → camelCase** — na jednom mestu, u `baseQuery`.
4. **Optimistic update obavezan** za toggle/like/delete — to je INP metrika.
5. **Polling samo eksplicitno**, per-endpoint, nikad globalno.
6. **Komponenta ne zove RTKQ hook direktno** — kroz feature hook ([`13-hooks.md`](13-hooks.md)).

## `baseQuery`

```ts
// packages/core/src/api/baseQuery.ts
const rawBaseQuery = fetchBaseQuery({
  baseUrl: env.VITE_API_URL,
  prepareHeaders: (headers, { getState }) => {
    const token = selectAccessToken(getState() as RootState);
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  },
});

const mutex = new Mutex();

export const baseQueryWithReauth: BaseQueryFn = async (args, api, extra) => {
  await mutex.waitForUnlock();
  let result = await rawBaseQuery(args, api, extra);

  if (result.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();
      try {
        const refresh = await rawBaseQuery({ url: '/auth/refresh', method: 'POST' }, api, extra);
        if (refresh.data) {
          api.dispatch(sessionRefreshed(refresh.data));
          result = await rawBaseQuery(args, api, extra);   // ponovi originalni zahtev
        } else {
          api.dispatch(loggedOut());
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await rawBaseQuery(args, api, extra);
    }
  }

  if (result.error) result.error = normalizeError(result.error);
  return result;
};
```

**Mutex je bitan:** bez njega pet paralelnih 401 odgovora pokreće pet refresh poziva, od kojih
četiri invalidiraju token koji je peti upravo dobio.

## `baseApi`

```ts
// packages/core/src/api/baseApi.ts
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Project', 'User', 'Session'],
  endpoints: () => ({}),
});
```

## Endpoint feature-a

```ts
// features/projects/api/projectsApi.ts
export const projectsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProjects: build.query<Project[], ProjectFilters>({
      query: (filters) => ({ url: '/projects', params: filters }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Project' as const, id })), { type: 'Project', id: 'LIST' }]
          : [{ type: 'Project', id: 'LIST' }],
    }),

    toggleFavorite: build.mutation<void, string>({
      query: (id) => ({ url: `/projects/${id}/favorite`, method: 'POST' }),
      // optimistic — korisnik ne čeka mrežu da vidi promenu (INP)
      async onQueryStarted(id, { dispatch, queryFulfilled, getState }) {
        const patches = projectsApi.util.selectInvalidatedBy(getState(), [{ type: 'Project' }]);
        const patch = dispatch(
          projectsApi.util.updateQueryData('getProjects', undefined, (draft) => {
            const p = draft.find((x) => x.id === id);
            if (p) p.isFavorite = !p.isFavorite;
          }),
        );
        try { await queryFulfilled; } catch { patch.undo(); }
      },
    }),
  }),
});

export const { useGetProjectsQuery, useToggleFavoriteMutation } = projectsApi;
```

Hookovi se eksportuju iz `api/`, ali ih **troši samo feature hook** — ne komponenta.

## `selectFromResult` — transformacija bez rerendera

```ts
const { activeCount } = useGetProjectsQuery(filters, {
  selectFromResult: ({ data }) => ({ activeCount: data?.filter((p) => p.isActive).length ?? 0 }),
});
```

Komponenta se rerenderuje samo kad se `activeCount` promeni, ne na svaku promenu liste.

## Prefetch na hover

```ts
const prefetch = usePrefetch('getProject');
<Link onMouseEnter={() => prefetch(project.id)} to={…} />
```

## Normalizovana greška

```ts
export type AppError = { code: string; messageKey: string; status: number; details?: unknown };
```

UI prikazuje `t(error.messageKey)` — nikad sirovu poruku sa servera, koja nije prevedena i
može da procuri interne detalje.

## Anti-patterns

| ❌ | ✅ |
|---|---|
| `useEffect(() => { fetch(...).then(setData) }, [])` | `useGetXQuery()` |
| drugi `createApi` u feature-u | `baseApi.injectEndpoints` |
| `refetch()` posle svake mutacije | `invalidatesTags` |
| kopiranje `data` u slice | čitaj iz hooka |
| `pollingInterval` globalno | per-endpoint, samo gde treba |
| delete bez optimistic update-a | `onQueryStarted` + `updateQueryData` |
| `data.user_name` po komponentama | `transformResponse` na jednom mestu |
| prikaz `error.data.message` sa servera | `t(error.messageKey)` |
| refresh bez mutexa | mutex — inače paralelni 401 ruše sesiju |

## Checklist

- [ ] Endpoint je dodat kroz `injectEndpoints`, ne novi `createApi`
- [ ] `providesTags`/`invalidatesTags` postavljeni (uključujući `LIST` tag)
- [ ] Mutacija koja menja vidljivo stanje ima optimistic update
- [ ] Tipovi zahteva i odgovora su eksplicitni, bez `any`
- [ ] MSW handler kolokovan uz feature ([`12-testing.md`](12-testing.md))
- [ ] Komponenta ne uvozi RTKQ hook direktno
- [ ] Greške prolaze kroz `normalizeError`
- [ ] Test: loading → success → error putanja
