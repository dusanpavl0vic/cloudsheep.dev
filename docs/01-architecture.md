# 01 — Arhitektura

> Status: active | Last review: 2026-10-08

Organizacija sledi `REACT_FRONTEND_STRUCTURE.md` (ADR [0011](adr/0011-layered-structure.md)),
prilagođenu Next.js-u (ADR [0009](adr/0009-nextjs-fullstack.md)). Ovaj dokument kaže **koja
pravila važe i gde se odstupa od šablona** — i zašto.

## 1. Osnovna pravila

1. **Sve konstante idu u `src/constants`.** Rute, API endpointi, RTK Query tagovi, tokeni teme,
   nazivi modala, ključevi kolačića, limiti. U komponentama nema URL-ova, putanja ni „magičnih"
   brojeva.
2. **Linkovi idu samo preko `ROUTES` i buildera** (`projectHref(slug)`). Navigacija ide kroz
   `Link`/`useRouter` iz `@/i18n/navigation`, koji sami dodaju jezički prefiks.
3. **Svaki tekst ide kroz i18n** (`t('...')`). U JSX-u nema običnih stringova.
4. **Komponente su prezentacione, logika je u hookovima** (`src/hooks`): API pozivi, `dispatch`,
   izvedeni podaci, parametri rute, efekti.
5. **Podaci:** javne stranice ih čitaju **na serveru** (`src/server/services`); na klijentu
   stižu **samo kroz RTK Query** (`src/store/api`). Globalni klijentski state je u slice-ovima,
   lokalni u `useState`.
6. **Svaka komponenta ima svoj folder** (`.tsx`, `.styles.ts`, `.types.ts`, opciono
   `.constants.ts`, `index.ts`).
7. **Funkcije su arrow funkcije:** `const name = () => {}` — komponente, hookovi, helperi,
   selektori, servisi.
8. **TypeScript strict, alias `@/` → `src/`, paket menadžer pnpm.**

## 2. Server i klijent

Next.js deli kod na serverske i klijentske module. Ovo je jedina stvar koju šablon nema, a
od koje zavisi i SEO i JS budžet.

| Modul | Gde se izvršava | Sme da uvozi |
|---|---|---|
| `app/**/page.tsx`, `layout.tsx` | server | `server/services`, View komponente, `constants`, `i18n` |
| `app/api/**/route.ts` | server | `server/**`, `constants`, `helpers`, `types` |
| `server/**` | server | `constants`, `helpers`, `types` — **nikad React, store ni hookove** |
| `*.styles.ts` | klijent (`'use client'` u prvom redu) | `styles/mixins`, `constants/theme`, `./X.constants` |
| `components/**/X.tsx` bez hookova | server | `useTranslations`, styled elementi, druge komponente |
| `components/**/X.tsx` sa hookovima | klijent (`'use client'`) | `hooks`, `constants`, `helpers` |
| `hooks/**`, `store/**`, `modals/**`, `providers/**` | klijent | `constants`, `helpers`, `types`, `store` |

**Pravila:**

- `'use client'` se stavlja na **najniži** modul kome treba — ne na View. View koji ima formu
  ostaje serverski i renderuje klijentsku `ContactBrief` komponentu.
- Tekst se prevodi **na serveru** gde god može (`useTranslations` radi i u serverskoj
  komponenti), pa se kao string prosleđuje styled elementu. Prevodi tako ne putuju u JS.
- `src/server/**` u klijentskom modulu je lint greška (`no-restricted-imports`). Tajne
  (`DATABASE_URL`, `JWT_SECRET`, SMTP) žive samo tamo.
- Props koji prelaze server → klijent granicu moraju biti serijalizabilni (bez funkcija,
  `Date` kao ISO string).

## 3. Odstupanja od šablona

| Šablon kaže | Ovde | Zašto |
|---|---|---|
| `router/AppRouter` + `ROUTE_TREE` | `src/app/` fajlovi; `page.tsx` je tanak i renderuje `<XView>` | Next rutira po fajlovima; `ROUTES` i builderi ostaju jedini izvor linkova |
| podaci samo kroz RTK Query | javne stranice čitaju `server/services` na serveru | Google mora da dobije sadržaj u HTML-u |
| jezik u `preferences` slice-u + localStorage | jezik iz URL-a (`/`, `/sr`) za javni sajt; admin ga čuva u slice-u | indeksiranje obe jezičke verzije (ADR [0012](adr/0012-locale-prefix.md)) |
| tema u localStorage | tema u kolačiću `cs-theme` | server odmah renderuje tačnu temu, bez treptaja i bez inline skripte (CSP) |
| `<title>` u View-u | `generateMetadata` u `page.tsx` | canonical, hreflang i OG oznake idu zajedno |
| `import.meta.env` u `constants/env.ts` | `process.env.NEXT_PUBLIC_*` u `constants/env.ts`; serverske promenljive u `server/env.ts` (zod) | Next ugrađuje samo `NEXT_PUBLIC_*` u klijentski kod |
| — | `src/server/` | backend je deo iste aplikacije (ADR [0009](adr/0009-nextjs-fullstack.md)) |
| — | admin domeni su u `components/admin/<domen>/`, `hooks/admin/<domen>/` | admin i javni sajt imaju isti domen (`projects`) sa potpuno drugačijim View-ovima |

## 4. Pravila zavisnosti

```
app ──► components (View) ──► hooks ──► store ──► constants, helpers, types
 │            │                                         ▲
 └──► server/services ──────────────────────────────────┘
```

- **Design system** (`foundations`, `buttons`, `inputs`, `data-display`, `feedback`,
  `navigation`, `overlays`, `media`, `sections`, `cards`, `layout`) ne zna za domen: ne uvozi
  `components/<domen>`, `hooks/<domen>` ni `store`. Tekst prima kao prop ili `children`.
- **Domenska komponenta** (`components/<domen>/`) sme da uvozi design system i hookove svog
  domena; ne uvozi drugi domen — deljeno se izdiže u design system ili `helpers`.
- **`hooks/`** ne uvozi `components/`. **`store/`** ne uvozi `hooks/` ni `components/`.
- **`helpers/`** su čiste funkcije: bez React-a, store-a i `server/`.
- **`constants/`** uvozi samo `types` i druge konstante.

Ova pravila proverava `import/no-restricted-paths` (`docs/16-tooling-ci.md` §2).

## 5. Gde šta ide — brza tabela

| Imaš… | Ide u… |
|---|---|
| putanju, endpoint, tag, limit, ključ kolačića | `constants/<tema>.ts` |
| tekst | `constants/i18n/en.ts` + `sr.ts` |
| boju, razmak, radijus, senku | `constants/theme/*` → tema |
| izgled komponente | `<Komponenta>.styles.ts` |
| logiku stranice (podaci, parametri, akcije) | `hooks/<domen>/use<Šta>.ts` |
| poziv API-ja sa klijenta | `store/api/<domen>/index.ts` |
| čitanje iz baze | `server/services/<domen>.ts` |
| HTTP ulaz | `app/api/**/route.ts` (tanak: parsiraj → servis → odgovor) |
| čistu transformaciju | `helpers/<tema>.ts` |
| oblik podatka iz API-ja | `types/<domen>.ts` |
