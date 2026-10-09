---
description: Pravi rutu u App Router-u — tanak page.tsx, View komponentu, generateMetadata (canonical, noindex za /sr), i18n i e2e smoke test
argument-hint: [public|admin] [Name] [path]
arguments: area Name path
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm lint:*), Bash(pnpm typecheck:*), Bash(pnpm exec eslint:*)
---

Napravi stranicu `$Name` na putanji `$path` ($area).

## Prvo pročitaj

- `docs/05-routing.md` — `app/` struktura, `ROUTES` i builderi linkova
- `docs/11-data-fetching.md` §1 — javne stranice čitaju podatke na serveru (servis, ne fetch)
- `docs/09-i18n.md` — `[locale]`, `/sr` je `noindex` (ADR 0012)

## Javna stranica

```
src/app/[locale]/(public)/<putanja>/page.tsx   tanak: params → servis → <${Name}View />
src/components/<domen>/${Name}View/            prikaz (folder po komponenti)
```

- Putanja u `constants/routes.ts` (`ROUTES` + builder ako ima parametar); linkovi samo kroz njih
- `generateMetadata` kroz `buildPageMetadata` (`helpers/seo.ts`): canonical, robots
  `noindex` za ne-podrazumevani jezik; JSON-LD kroz `<JsonLd>` ako ima smisla
- Nepostojeći slug → `notFound()` (pravi 404)
- Ako ide u indeks: dodaj u `app/sitemap.ts` (samo engleske adrese)
- Podaci keširani po tagu (`server/cache.ts`), servis u `server/services/<domen>.ts`
- Bez RTK Query-ja na javnim stranicama (JS budžet, ADR 0014)

## Admin stranica

```
src/app/admin/(app)/<putanja>/page.tsx         tanak: params/searchParams → <${Name}View />
src/components/admin/<domen>/${Name}View/      prikaz; podaci kroz hooks/admin/<domen>
```

- Stavka menija u `ADMIN_NAV_ITEMS` (`constants/navigation.ts`) + `admin.nav.*` ključ
- Filteri i paginacija u URL-u (`searchParams`), ne u stanju

## Acceptance

- `pnpm typecheck`, `pnpm exec eslint` prolaze; ključevi u `en.ts` i `sr.ts`
- e2e smoke u `e2e/` (status 200, naslov; za javnu: canonical i robots)
- Javna: `pnpm build && pnpm size` ispod budžeta
