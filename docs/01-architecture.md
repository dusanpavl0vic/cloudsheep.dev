# 01 — Arhitektura

> Status: active | Last review: 2026-08-15

Aplikacija se seče **po domenu**, ne po tipu fajla. Nema foldera `containers/`, `views/`,
`helpers/` u koje se sleže sve što ne zna gde bi.

## Pravila

### 1. Feature folder sadrži sve što taj domen treba

```
features/auth/
├── api/          authApi.ts          — RTKQ injectEndpoints
├── components/   LoginForm.tsx
├── modals/       LoginModal.tsx
├── hooks/        useAuth.ts          ← javni API feature-a
├── store/        auth.slice.ts, auth.selectors.ts
├── schemas/      login.schema.ts     — zod
├── locales/      sr.json, en.json    — namespace "auth"
├── types.ts
├── __tests__/
└── index.ts      — public API
```

**Test:** feature se briše `rm -rf` i ništa osim njegovih ruta ne pukne. Ako pukne —
granica je propuštena.

### 2. Import sme samo naniže

```
providers / routes / store   →  sve
pages                        →  features, components, hooks, lib, packages
features                     →  components, hooks, lib, packages
                                ❌ feature NE SME importovati drugi feature
components / hooks / lib     →  packages
packages/ui                  →  packages/utils, packages/hooks   ❌ ne core/store
packages/core                →  packages/utils
packages/utils               →  ništa (zero-dep)
```

### 3. Feature ne importuje feature

Ako feature A treba nešto iz B, postoje tri legitimna izlaza — i nijedan nije direktan import:

| Situacija | Rešenje |
|---|---|
| deljena **komponenta** | izdigni u `apps/<x>/src/components/` |
| deljena **logika** | izdigni u `apps/<x>/src/hooks/` ili `lib/` |
| treba **podatak** iz drugog domena | čitaj iz store-a, ili RTKQ endpoint sa `providesTags` |

### 4. Public API feature-a je uzak

`index.ts` eksportuje **samo** hookove, tipove i komponente. Slice, selektori i API endpointi
ostaju unutra — oni su implementacija.

```ts
// features/auth/index.ts
export { useAuth, useLogin, useLogout } from './hooks';
export { LoginForm } from './components/LoginForm';
export type { AuthUser } from './types';
// ❌ export { authSlice }        — NIKAD
// ❌ export { selectCurrentUser } — NIKAD
```

Razlog: čim slice iscuri napolje, neko će ga dispatch-ovati iz druge app-e ili feature-a i
granica prestaje da postoji. Selektor koji stvarno treba drugima → izdigni ga u `hooks/`.

### 5. Prag za izdizanje u `packages/`

Kod ide u `packages/` **tek kad ga koristi druga aplikacija**. Do tada živi u
`apps/<x>/lib` ili `apps/<x>/components`.

Prerano izdizanje je najčešća greška u monorepoima: dobiješ paket sa jednim potrošačem,
verzionisanjem, build korakom i PR-om preko dva foldera — a nemaš nijednu korist.

### 6. Enforcement

Granice nisu stvar dobre volje. `eslint-plugin-import` sa `no-restricted-paths`:

```js
'import/no-restricted-paths': ['error', { zones: [
  { target: './src/features/*', from: './src/features/*', except: ['./index.ts'] },
  { target: './src/components', from: './src/features' },
  { target: './src/lib',        from: ['./src/features', './src/pages'] },
]}]
```

Namerno kršenje granice **obara build**. To je dokazano testom u F7 — vidi
[`19-code-review-checklist.md`](19-code-review-checklist.md).

## Primeri

**✅ Dva feature-a kojima treba isti `UserAvatar`**

```
apps/web/src/components/UserAvatar/    ← izdignuto, oba ga importuju
features/profile/  → import { UserAvatar } from '@/components/UserAvatar'
features/comments/ → import { UserAvatar } from '@/components/UserAvatar'
```

**✅ `comments` feature-u treba ime ulogovanog korisnika**

```ts
// features/comments/hooks/useCommentForm.ts
const { user } = useAuth();   // iz javnog API-ja auth feature-a — ovo je dozvoljeno
```

Import `@/features/auth` (barrel) je dozvoljen; `@/features/auth/store/auth.slice` nije.

## Anti-patterns

| ❌ | Zašto je problem | ✅ |
|---|---|---|
| `import { authSlice } from '@/features/auth/store/auth.slice'` | zaobilazi javni API; lint pada | koristi `useAuth()` iz barrel-a |
| `features/x/components/` puna komponenti koje koriste svi | to više nije feature nego kanta | izdigni u `src/components/` |
| paket u `packages/` sa jednim potrošačem | monorepo overhead bez koristi | vrati u `apps/<x>/lib` |
| `utils.ts` u feature-u | ime bez značenja, raste zauvek | imenuj po poslu: `formatInvoice.ts` |
| feature koji importuje `pages/` | obrnut smer zavisnosti | page komponuje feature, ne obrnuto |

## Kada ovo prestane da važi

Feature folders skalira do određene tačke. **Preko ~20 feature-a i 5+ developera** kanonski
FSD (`entities` sloj, `steiger` linter) postaje razumniji izbor — migracija je izvodljiva
upravo zato što su granice već enforce-ovane lintom, pa se radi mehanički.

Obrazloženje zašto nismo krenuli od FSD-a: [`adr/0004-feature-folders-vs-fsd.md`](adr/0004-feature-folders-vs-fsd.md).

## Checklist

- [ ] Novi kod je u feature-u, ne u `components/`/`lib/` "za svaki slučaj"
- [ ] Feature ne importuje drugi feature (osim kroz barrel, i to samo hookove/tipove/komponente)
- [ ] `index.ts` feature-a ne eksportuje slice, selektore ni endpointe
- [ ] Ništa nije izdignuto u `packages/` dok nema **drugog** potrošača
- [ ] `pnpm lint` prolazi — `no-restricted-paths` je error, ne warning
