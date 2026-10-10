# 12 — Testiranje

> Status: active | Last review: 2026-10-09

Alati su Vitest 4 (projekti `unit` i `db`) i Playwright (e2e nad produkcionim build-om).

## Piramida

| Nivo | Gde | Komanda | Šta se testira |
| --- | --- | --- | --- |
| Unit | `src/**/*.test.ts` | `pnpm test` (projekat `unit`) | helperi, zod šeme i pretvaranja forme, store, serverski kod bez baze (`server/http`, mail šabloni, CV raspored), ESLint pravila |
| Hook / komponenta | `// @vitest-environment jsdom` u prvom redu | isto | hook sa netrivijalnim efektom (`useRevealOnScroll`, `useCarousel`) |
| Baza | `src/**/*.db.test.ts` | projekat `db` | servisi nad **pravim** Postgres-om (`appdb_test`), sekvencijalno |
| E2E | `e2e/*.spec.ts` | `pnpm build && pnpm e2e` | tok u pravom pregledaču: forme, SEO, admin |

**Vitest je `.test.` u `src/`, a Playwright je `.spec.` u `e2e/`.** Vitest-ov podrazumevani
obrazac bi pokupio i Playwright fajlove.

## Pravila

1. **Logika koja se testira je čista funkcija** (`helpers/`, `schemas/`). Hook je tanak, pa
   je i test hook-a redak. Vidi `13-hooks.md`.
2. **Baza se ne mock-uje.** Atomično zauzimanje termina, jedinstvenost adrese i double
   opt-in potvrda dokazuju se samo nad pravim Postgres-om (projekat `db`).
3. **Ispravka greške počinje testom koji pada.** Primeri: `readPatch` u `server/http.test.ts`,
   zatim `useRevealOnScroll` pod Strict Mode i `postJson` sa `API_BASE_URL`.
4. **Upiti po ulozi i oznaci:** `getByRole` > `getByLabel` > `getByText`. `data-testid` je
   poslednja opcija.
5. **E2E ne zavisi od tajni u repou.** Admin nalog dolazi iz `SEED_ADMIN_EMAIL/PASSWORD`.
   Bez njih se `e2e/admin.spec.ts` preskače.
6. **Test ne ostavlja podatke.** E2E pravi zapise sa jedinstvenim imenom (`Date.now()`) i
   briše ih.

## E2E

`playwright.config.ts` podiže `next start` na portu 3400 (NODE_ENV=production) i čeka
`/api/health`. Lokalno se može ciljati već pokrenut server:

```bash
E2E_BASE_URL=http://localhost:3200 pnpm e2e
```

| Spec | Pokriva |
| --- | --- |
| `seo.spec.ts` | 200/404, canonical, `/sr` noindex, sitemap samo na engleskom, `X-Robots-Tag` na `/admin` i `/api` |
| `contact.spec.ts` | upit: domen bez MX-a se odbija na polju; ispravan upit čeka potvrdu linkom |
| `newsletter.spec.ts` | prijava u podnožju: loš domen se odbija, ispravna adresa prolazi |
| `admin.spec.ts` | prijava i istek sesije; CRUD kroz dijalog; objava jednim klikom ne briše ostala polja |

E2E nosi samo ono što zahteva pravi pregledač i server: rutiranje, kolačiće, zaglavlja,
hidrataciju forme i dijaloge sa fokusom. Sve ostalo ostaje u Vitest-u, jer je tamo brže i
preciznije.

## Anti-patterns

| ❌ | ✅ |
|---|---|
| mock Prisma klijenta | `*.db.test.ts` nad `appdb_test` |
| `container.querySelector('.Button_root…')` | `getByRole('button', { name })` |
| `fireEvent` | `user-event` (ili Playwright) |
| e2e koji zavisi od seed podataka po imenu | test sam pravi i briše svoj zapis |
| `waitForTimeout` u e2e | `expect(...).toBeVisible()` (sam čeka) |

## Checklist

- [ ] Nova čista funkcija ili šema ima test pored sebe
- [ ] Servis koji piše u bazu ima `*.db.test.ts` za granične slučajeve
- [ ] Ispravka greške ima test koji je pre ispravke padao
- [ ] Novi kritični tok (forma, admin akcija) ima e2e
