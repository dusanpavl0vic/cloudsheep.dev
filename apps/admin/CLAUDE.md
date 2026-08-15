# apps/admin

Interni panel iza autentikacije. Odvojen Vercel projekat i odvojen domen od `web`.

Root pravila važe — vidi `/CLAUDE.md` i `docs/`. Ovde su samo specifičnosti ove app-e.

## Šta je posebno

**Ovo je referentna app.** `auth` feature je napisan kao **živa dokumentacija** svih pravila
iz `docs/` — kad nisi siguran kako se nešto radi, pogledaj kako je urađeno tamo.

Tvrd zahtev na koji se `auth` drži i koji CI proverava:
**0 `useEffect`, najviše 2 `useState` u celom feature-u.**

Ako dodaješ nešto u `auth` i treba ti `useEffect` — skoro sigurno grešiš. Proveri whitelist
u `docs/07-performance.md` §3.

## `auth` feature — šta pokriva

| Sloj | Šta demonstrira |
|---|---|
| `api/authApi.ts` | RTKQ `injectEndpoints`, `login`/`logout`/`me`/`refresh`, tagovi |
| `store/auth.slice.ts` | session state, akcije kao događaji (`sessionEstablished`) |
| `store/auth.selectors.ts` | `createSelector` |
| `hooks/useAuth.ts` | javni API feature-a, hook-first pravilo |
| `hooks/useLogin.ts` | odvojen hook jer radi drugu stvar |
| `components/LoginForm/` | RHF + zod + i18n poruke grešaka, **nula `useState`** |
| `modals/LoginModal.tsx` | registry, promise rezultat, `ModalPropsMap` |
| `schemas/login.schema.ts` | zod kao jedini izvor istine za tip |
| `locales/{sr,en}.json` | namespace + ICU plural primer |
| `__tests__/` | pun set: reducer → selektor → hook → komponenta → integracija |

Guard `RequireAuth` je u `routes/`, ne u feature-u — koristi ga router, ne domen.

## Sigurnost

Ovo je app iza logina, pa pravila iz `docs/20-security.md` nisu teorijska:

- **Access token u memoriji (Redux).** Nikad `localStorage`
- **Refresh token u `httpOnly` cookie** — JavaScript ga ne čita
- Refresh flow ima **mutex** — bez njega paralelni 401 odgovori pokreću više refresh poziva
  koji se međusobno invalidiraju (`docs/11-data-fetching.md`)
- Frontend guard krije UI; **autorizaciju proverava backend**. `RequireAuth` nije sigurnost

## Razlike u odnosu na `web`

| | `web` | `admin` |
|---|---|---|
| Lighthouse budžet | tvrd (100/92 baseline) | blaži — nema SEO ni javne publike |
| SEO / meta tagovi | kritični | nebitni (`noindex`) |
| Backend | nema | ima |
| Autentikacija | nema | cela app |
| Sadržaj | statičan, iz `.constants.ts` | dinamičan, sa API-ja |

Budžeti i dalje postoje — samo nisu isti. Vidi `.size-limit.json`.

## Liste

Admin panel znači tabele. **Lista > 100 stavki mora biti virtualizovana**
(`@tanstack/react-virtual`), bez izuzetka — `docs/07-performance.md` §5.

Filteri i paginacija idu u URL (`useSearchParams`), ne u Redux — deljiv link na filtriran
prikaz je u admin panelu češće potreban nego na sajtu.

## Deploy

Vercel projekat `cloudsheep-admin`, root directory `apps/admin`.
Grane prate istu šemu kao `web`: `dev` → preview, `main` → test, `prod` → production.

## Checklist pre PR-a

- [ ] `pnpm validate` prolazi
- [ ] `auth` i dalje ima 0 `useEffect` i ≤ 2 `useState`
- [ ] Nova lista > 100 stavki je virtualizovana
- [ ] Filteri su u URL-u, ne u Redux-u
- [ ] Nijedan token nije završio u `localStorage`
- [ ] E2E pokriva izmenjen flow
