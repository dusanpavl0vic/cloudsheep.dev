# 13 — Hookovi

> Status: active | Last review: 2026-08-15

**Svaka funkcionalnost se izlaže kroz hook. Komponente su glupe.**

Ovo je pravilo o koje se lomi sve ostalo: ako logika živi u hookovima, testiranje je lako
([`12-testing.md`](12-testing.md)), granice se poštuju ([`01-architecture.md`](01-architecture.md)),
a komponenta ostaje zamenjiva.

## Pravila

1. **Komponenta ne sme direktno da zove `useAppSelector`, `useAppDispatch` ni RTKQ hook.**
   Sve kroz feature hook.
2. **Feature hook je jedini sloj koji zna za Redux.**
3. **Hook vraća objekat sa stabilnim ključevima:** `{ data, isLoading, error, ...actions }`.
   Nikad niz osim za `useState`-like API sa tačno dva člana.
4. **Hook nikad ne vraća JSX.** Ako vraća — to je komponenta.
5. **Hook koji radi više stvari se deli.** `useAuth` ≠ `useAuthAndProfileAndSettings`.
6. **Hook koji ne koristi nijedan React hook nije hook** — to je obična funkcija, u `lib/`.

## Gde koji hook živi

| Tip hooka              | Lokacija                      | Primer                             |
| ---------------------- | ----------------------------- | ---------------------------------- |
| Domenski               | `features/<x>/hooks/`         | `useAuth`, `useProjectFilters`     |
| App-specifičan deljeni | `apps/<x>/src/hooks/`         | `useRouteScroll`                   |
| Generički React        | `@app/hooks`                  | `useDebounce`, `useMediaQuery`     |
| Store-tipizirani       | `apps/<x>/src/store/hooks.ts` | `useAppDispatch`, `useAppSelector` |
| UI (ne-domenski)       | `@app/ui`                     | `useDisclosure`                    |

Pravilo za odluku: **zna li hook za domen?** Ako da → feature. Ako ne, ali zna za ovu app →
`apps/<x>/src/hooks`. Ako ne zna ni za šta → `@app/hooks`.

## Primeri

```ts
// ✅ features/auth/hooks/useAuth.ts
export function useAuth() {
  const user = useAppSelector(selectCurrentUser)
  const { isLoading } = useGetMeQuery(undefined, { skip: user !== null })

  return {
    user,
    isAuthenticated: user !== null,
    isLoading,
  }
}
```

```ts
// ✅ features/auth/hooks/useLogin.ts — odvojen, jer radi drugu stvar
export function useLogin() {
  const dispatch = useAppDispatch()
  const [loginMutation, { isLoading, error }] = useLoginMutation()

  const login = useCallback(
    async (input: LoginInput) => {
      const result = await loginMutation(input)
      if ('data' in result) dispatch(sessionEstablished(result.data))
      return result
    },
    [dispatch, loginMutation],
  )

  return { login, isLoading, error }
}
```

```tsx
// ❌ komponenta zna za Redux i RTKQ
function UserMenu() {
  const user = useSelector((s: RootState) => s.auth.user);
  const [logout] = useLogoutMutation();
  const dispatch = useDispatch();
  …
}

// ✅ komponenta zna samo za hook
function UserMenu() {
  const { user } = useAuth();
  const { logout, isLoading } = useLogout();
  …
}
```

## Oblik povratne vrednosti

```ts
// ✅ objekat — dodavanje polja ne lomi pozivaoce
return { data, isLoading, error, refresh }

// ❌ niz — pozicija je API, dodavanje u sredinu lomi sve
return [data, isLoading, error]
```

Izuzetak: hook sa tačno dva člana koji imitira `useState` (`const [value, setValue] = useToggle()`).

## Katalog

### `@app/hooks` — generički

| Hook              | Potpis                                | Namena                      |
| ----------------- | ------------------------------------- | --------------------------- |
| `useDebounce`     | `(value: T, delay: number) => T`      | odloženo praćenje vrednosti |
| `useMediaQuery`   | `(query: string) => boolean`          | responsivni breakpoint      |
| `useIntersection` | `(ref, options) => boolean`           | vidljivost u viewport-u     |
| `useToggle`       | `(initial?) => [boolean, () => void]` | boolean prekidač            |
| `usePrevious`     | `(value: T) => T \| undefined`        | prethodna vrednost          |

### `@app/ui` — UI, ne-domenski

| Hook            | Namena                                                                                |
| --------------- | ------------------------------------------------------------------------------------- |
| `useDisclosure` | open/close/toggle za prezentacione elemente (**ne** za modale — [`06`](06-modals.md)) |

### `apps/web/src/hooks`

| Hook             | Namena                                                                        |
| ---------------- | ----------------------------------------------------------------------------- |
| `useRouteScroll` | scroll na vrh pri promeni rute                                                |
| `useTypewriter`  | animacija kucanja; poštuje `prefers-reduced-motion`                           |
| `usePointerGlow` | svetlo koje prati kursor po grupi panela; vraća ref za KONTEJNER, ne za panel |

### `features/auth/hooks`

| Hook        | Vraća                                  |
| ----------- | -------------------------------------- |
| `useAuth`   | `{ user, isAuthenticated, isLoading }` |
| `useLogin`  | `{ login, isLoading, error }`          |
| `useLogout` | `{ logout, isLoading }`                |

> Novi hook se dodaje sa `/new-hook <scope> <useName>` — komanda upisuje i red u ovu tabelu.

## Anti-patterns

| ❌                                      | Zašto                   | ✅                     |
| --------------------------------------- | ----------------------- | ---------------------- |
| `useSelector` u komponenti              | komponenta zna za Redux | feature hook           |
| `useGetProjectsQuery()` u komponenti    | isto, za server state   | `useProjects()`        |
| hook koji vraća `<Spinner />`           | to je komponenta        | vrati `isLoading`      |
| `useEverything()` sa 12 povratnih polja | radi previše            | podeli po odgovornosti |
| hook u `lib/` bez ijednog React hooka   | nije hook               | obična funkcija        |
| hook koji zove drugi feature direktno   | probija granicu         | kroz barrel ili store  |
| `useAuth()` koji i loguje i menja temu  | dve odgovornosti        | dva hooka              |

## Checklist

- [ ] Nova logika je u hooku, ne u komponenti
- [ ] Hook je na pravom nivou (feature / app / paket)
- [ ] Vraća objekat sa stabilnim ključevima
- [ ] Ne vraća JSX
- [ ] Radi jednu stvar
- [ ] Ima test (`renderHook`), pokrivenost ≥ 90% za feature hookove
- [ ] Upisan u katalog iznad ako je deljiv
- [ ] Nijedna komponenta ne uvozi `useAppSelector`/RTKQ hook direktno
