# 13 — Hookovi

> Status: active | Last review: 2026-10-09

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
6. **Hook koji ne koristi nijedan React hook nije hook** — to je obična funkcija, u `helpers/`.
7. **React Compiler memoizuje sve** — `useMemo`/`useCallback` se ne pišu (osim slučajeva iz
   `07-performance.md` §2). Posledica: RHF `formState` i `watch` se ne čitaju direktno, nego
   kroz `useFormState`/`useWatch` (`10-forms-validation.md`).

## Gde koji hook živi

| Tip hooka           | Lokacija                     | Primer                                   |
| ------------------- | ---------------------------- | ---------------------------------------- |
| Domenski (javni)    | `src/hooks/<domen>/`         | `useBriefForm`, `useEstimator`           |
| Domenski (admin)    | `src/hooks/admin/<domen>/`   | `useTechnologies`, `useNoteEditor`       |
| Admin, zajednički   | `src/hooks/admin/`           | `useAdminForm`, `useAdminAction`         |
| Generički React     | `src/hooks/`                 | `useMediaQuery`, `useInView`, `useModal` |
| Store-tipizirani    | `src/hooks/useStore.ts`      | `useAppDispatch`, `useAppSelector`       |

Pravilo za odluku: **zna li hook za domen?** Ako zna, ide u `hooks/<domen>/`. Ako ne zna
ni za šta, ide u koren `hooks/`. Admin hook nikad ne uvoze javne stranice: admin RTKQ
endpointi ne smeju u njihov JS.

## Primeri

```ts
// ✅ hooks/admin/session/useAdminSession.ts — jedini sloj koji zna za store i RTKQ
export const useAdminSession = () => {
  const status = useAppSelector(selectSessionStatus)
  const user = useAppSelector(selectSessionUser)
  useRestoreSessionQuery(undefined, { skip: status !== 'unknown' })

  return { status, user }
}
```

```ts
// ✅ hooks/admin/technologies/useTechnologies.ts — spisak sa akcijama, bez JSX-a
export const useTechnologies = () => {
  const query = useGetTechnologiesQuery(undefined)
  const [reorder] = useReorderTechnologiesMutation()
  const [deleteTechnology] = useDeleteTechnologyMutation()
  const { remove } = useAdminAction()
  const form = useModal(MODALS.ADMIN_TECHNOLOGY_FORM)
  const items = query.data ?? []

  return {
    items,
    isLoading: query.isLoading,
    isError: query.isError,
    order: useReorder(items, (ids) => reorder(ids).unwrap()),
    add: () => form.open(),
    edit: (technology: AdminTechnology) => form.open({ id: technology.id }),
    remove: (technology: AdminTechnology) =>
      remove(t('deleteConfirm', { name: technology.label }), () => deleteTechnology(technology.id).unwrap()),
  }
}
```

```tsx
// ❌ komponenta zna za Redux i RTKQ
const TechnologiesView = () => {
  const { data } = useGetTechnologiesQuery(undefined)
  const dispatch = useAppDispatch()
  …
}

// ✅ komponenta zna samo za hook
const TechnologiesView = () => {
  const tech = useTechnologies()
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

### Generički (`src/hooks/`)

| Hook | Namena |
| --- | --- |
| `useAppDispatch` / `useAppSelector` / `useAppStore` | tipizirani store (samo u hookovima) |
| `useModal(name)` | `open(props?)` / `close()` / `isOpen` / `props` za modal iz `ui.modals` ([`06`](06-modals.md)) |
| `useConfirm()` | `await confirm({ message, danger? })` → `boolean`, bez `window.confirm` |
| `useToast()` / `useToastQueue()` / `useToastTimer(id)` | poruka u uglu; red za `ToastContainer`; samostalno gašenje |
| `useKeyTranslator()` / `useApiErrorMessage()` | prevod i18n ključa iz zod-a ili sa servera; `ParsedApiError` → tekst |
| `useHydrated()` | `true` posle hidratacije (dugme za slanje forme do tada onemogućeno) |
| `useMediaQuery(query)` / `useReducedMotion()` | media query; `prefers-reduced-motion` |
| `useInView(ref)` / `useScrollProgress()` / `useNow(ms)` | vidljivost; napredak skrola; sat koji kuca |
| `useEscapeKey` / `useFocusTrap` / `useLockBodyScroll` | mehanika `Overlay`-a |
| `useCarousel` / `useCountUp` / `useTyper` | karusel; brojanje do vrednosti; kucanje teksta |

### Javni sajt (`src/hooks/<domen>/`)

| Hook | Namena |
| --- | --- |
| `contact/useBriefForm` | upit u 3 koraka (RHF, lenji zod resolver, termin, 409 → osveži termine) |
| `contact/useEmailCheck` / `contact/useFreeSlots` | provera adrese pri napuštanju polja; termini grupisani po danu |
| `newsletter/useNewsletterSignup` | prijava (double opt-in) |
| `estimator/useEstimator` | procena cene i roka |
| `navigation/useMainNav` / `useActiveSection` | meni; sekcija u kojoj je korisnik |
| `preferences/useThemeToggle` / `useLocaleSwitch` | tema (kolačić); jezik (čuva putanju, upit i heš) |
| `effects/useRevealOnScroll` / `usePointerEffects` / `useScrollEffects` | otkrivanje pri skrolu; sjaj za kursorom; efekti skrola |

### Admin (`src/hooks/admin/`)

| Hook | Namena |
| --- | --- |
| `session/useAdminSession` / `useRequireAdmin` | sesija (obnova iz httpOnly kolačića); bez nje → prijava |
| `session/useLogin` / `useLogout` / `useAdminLocale` / `useAdminNav` | prijava; odjava; jezik admin-a (kolačić + `refresh`); meni |
| `useAdminForm({ schema, defaultValues, save, onSaved?, onInvalid? })` | RHF + zod; greška polja sa servera na polje; toast ([`10`](10-forms-validation.md)) |
| `useAdminAction()` | `run(action, 'saved' \| 'deleted')` sa toast-om; `remove(message, action)` = potvrda + brisanje |
| `useReorder(items, reorder)` | `canMove(i, ±1)` / `move(i, ±1)` → ceo novi redosled |
| `useImageUpload(onUploaded)` | `pick(file)` → otpremi → `Asset` |
| `<domen>/use<Domen>s` | spisak: `{ items, isLoading, isError, order?, add, edit, remove, toggle… }` |
| `<domen>/use<Domen>Form(id, onSaved)` | dijalog dodaj/izmeni (čita zapis iz RTKQ keša po `id`) |
| `<domen>/use<Domen>Page(id)` + `use<Domen>Editor(record)` | stranica editora: prvo podaci, pa forma sa tačnim podrazumevanim vrednostima |
| `dashboard/useDashboard` | brojke iz istih upita kao stranice (keš se deli) |

## Anti-patterns

| ❌                                      | Zašto                   | ✅                     |
| --------------------------------------- | ----------------------- | ---------------------- |
| `useAppSelector` u komponenti           | komponenta zna za Redux | domenski hook          |
| `useGetProjectsQuery()` u komponenti    | isto, za server state   | `useProjects()`        |
| `form.formState` / `form.watch` uz Compiler | memoizovan proxy — stara vrednost | `useFormState` / `useWatch` |
| hook koji vraća `<Spinner />`           | to je komponenta        | vrati `isLoading`      |
| `useEverything()` sa 12 povratnih polja | radi previše            | podeli po odgovornosti |
| hook u `lib/` bez ijednog React hooka   | nije hook               | obična funkcija        |
| hook koji zove drugi feature direktno   | probija granicu         | kroz barrel ili store  |
| `useAuth()` koji i loguje i menja temu  | dve odgovornosti        | dva hooka              |

## Checklist

- [ ] Nova logika je u hooku, ne u komponenti
- [ ] Hook je na pravom nivou (generički / domenski / admin)
- [ ] Vraća objekat sa stabilnim ključevima
- [ ] Ne vraća JSX
- [ ] Radi jednu stvar
- [ ] Netrivijalna logika ima test (čista funkcija u `helpers/` ili `renderHook`)
- [ ] Upisan u katalog iznad ako je deljiv
- [ ] Nijedna komponenta ne uvozi `useAppSelector`/RTKQ hook direktno
