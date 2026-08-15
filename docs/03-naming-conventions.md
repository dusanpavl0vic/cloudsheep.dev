# 03 — Konvencije imenovanja

> Status: active | Last review: 2026-08-15

## Pravila

| Entitet | Konvencija | Primer |
|---|---|---|
| Folder | `kebab-case` | `user-profile/` |
| Folder komponente | `PascalCase` | `ProjectCard/` |
| React komponenta (fajl + export) | `PascalCase` | `UserCard.tsx` |
| shadcn primitiv u `packages/ui/src/ui/` | `kebab-case`, flat | `alert-dialog.tsx` |
| Hook | `camelCase` sa `use` prefiksom | `useUserProfile.ts` |
| Slice | `<domain>.slice.ts` | `auth.slice.ts` |
| Selektori | `<domain>.selectors.ts`, export `select*` | `selectCurrentUser` |
| RTKQ API | `<domain>Api.ts` | `authApi.ts` |
| Zod šema | `<name>.schema.ts`, export `*Schema` | `loginSchema` |
| Varijante | `<Ime>.variants.ts`, export `*Variants` | `buttonVariants` |
| Konstante komponente | `<Ime>.constants.ts` | `HeroSection.constants.ts` |
| Tipovi | `types.ts`, **bez `I` prefiksa** | `type User = {}` |
| Test | kolokovan `*.test.ts(x)` | `useAuth.test.ts` |
| E2E | `e2e/*.spec.ts` | `login.spec.ts` |
| Konstante (vrednosti) | `SCREAMING_SNAKE` | `MAX_UPLOAD_SIZE` |
| Barrel | `index.ts` — samo na granici feature-a/paketa | |
| Ostali fajlovi | `camelCase` | `storageKeys.ts` |

### i18n ključevi

Format je `feature.section.element` — **nikad tekst kao ključ**.

```
✅ auth.login.submitButton
✅ projects.filters.emptyState
❌ "Prijavi se"
❌ loginButton            (nema feature prefiks)
```

### Imenovanje po nameri, ne po tipu

```ts
✅ formatInvoiceTotal.ts     ❌ helpers.ts
✅ isExpired.ts              ❌ dateUtils.ts
✅ useCheckoutSummary.ts     ❌ useData.ts
```

Ime fajla mora da odgovori na "šta ovo radi" bez otvaranja fajla.

### Booleani i handleri

| Vrsta | Prefiks | Primer |
|---|---|---|
| boolean state/prop | `is` / `has` / `can` / `should` | `isLoading`, `hasAccess`, `canSubmit` |
| event handler prop | `on` | `onSubmit`, `onSelect` |
| handler implementacija | `handle` | `handleSubmit` |
| async akcija | glagol | `login`, `deleteProject` |

## Zabranjeno

| ❌ Zabranjeno | Zašto | ✅ Umesto |
|---|---|---|
| `default export` za komponente | ime se gubi pri importu, refactor ne hvata | imenovani export |
| `utils.ts` / `helpers.ts` / `misc.ts` | kanta za smeće koja raste zauvek | ime po poslu |
| `I` prefiks za interfejse (`IUser`) | mađarska notacija, TS je ne traži | `type User` |
| `components/` bez domena unutar feature-a | to više nije feature | podeli po domenu ili izdigni |
| fajl > **200 linija** | signal da radi previše stvari | podeli |
| komponenta > **150 linija** | isto | izvuci pod-komponentu ili hook |
| magični string/broj u kodu | ne može se pretražiti ni promeniti na jednom mestu | imenovana konstanta |

**Jedini izuzetak za `default export`:** lazy route moduli, gde ga React Router zahteva.

```ts
// ✅ pages/Dashboard.tsx — lazy route modul
export default function DashboardPage() { … }
```

## Primeri

```
features/auth/
├── api/authApi.ts                    export const authApi
├── hooks/useAuth.ts                  export function useAuth()
├── hooks/useAuth.test.ts
├── store/auth.slice.ts               export const authReducer, loggedOut
├── store/auth.selectors.ts           export const selectCurrentUser
├── schemas/login.schema.ts           export const loginSchema
├── components/LoginForm/
│   ├── LoginForm.tsx                 export function LoginForm()
│   ├── LoginForm.variants.ts         export const loginFormVariants
│   ├── LoginForm.test.tsx
│   └── index.ts                      export { LoginForm } from './LoginForm'
├── locales/sr.json                   namespace "auth"
├── types.ts                          export type AuthUser
└── index.ts                          javni API
```

## Anti-patterns

```ts
// ❌ ime ne kaže ništa
const data = useSelector(selectData);
function process(x: unknown) {}

// ✅
const invoices = useAppSelector(selectPendingInvoices);
function normalizeInvoiceResponse(raw: RawInvoice) {}
```

```ts
// ❌ magični broj
if (file.size > 5242880) throw new Error('too big');

// ✅
const MAX_UPLOAD_SIZE = 5 * 1024 * 1024;
if (file.size > MAX_UPLOAD_SIZE) throw new UploadTooLargeError();
```

```ts
// ❌ boolean bez prefiksa — čita se kao akcija
const submit = form.formState.isValid;

// ✅
const canSubmit = form.formState.isValid;
```

## Checklist

- [ ] Nijedan `default export` osim lazy route modula
- [ ] Nijedan fajl > 200 linija, nijedna komponenta > 150
- [ ] Nema `utils.ts`/`helpers.ts`
- [ ] Svaki i18n ključ ima `feature.` prefiks
- [ ] Booleani imaju `is`/`has`/`can`/`should` prefiks
- [ ] Nema magičnih vrednosti — sve imenovano
- [ ] Ime fajla odgovara na "šta ovo radi" bez otvaranja
