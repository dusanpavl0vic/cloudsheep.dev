# 02 — Struktura foldera

> Status: active | Last review: 2026-10-08

```
prisma/                      schema.prisma, migrations/, seed.ts, seed/
assets/fonts/                fontovi za PDF CV (server, ne pregledač)
public/                      fontovi, favicon, og.png (statično, verzionisano u repou)
scripts/                     check-size.mjs (JS budžet), lighthouse
e2e/                         Playwright testovi
infra/                       docker-compose.yml (lokalni Postgres), Dockerfile, uputstva za server

src/
  app/                       rutiranje (Next.js) — samo tanki fajlovi
    layout.tsx               <html>, fontovi, tema iz kolačića
    [locale]/
      layout.tsx             StoreProvider, I18nProvider, RootLayout (javni ModalRoot)
      (public)/              javni sajt: header + footer
        error.tsx            granica greške stranica (u (public), docs/07 §6a)
        page.tsx             → HomeView
        projects/page.tsx    → ProjectsView
        projects/[slug]/     → ProjectView (studija slučaja)
        notes/page.tsx       → NotesView
        notes/[slug]/        → NoteView
        contact/page.tsx     → ContactView
      [...rest]/page.tsx     notFound() — lokalizovana 404 sa kodom 404
      not-found.tsx
    admin/
      layout.tsx             jezik iz kolačića, AdminModalRoot, ToastContainer, noindex
      (guest)/login/         samo gosti (AuthLayout)
      (app)/…                samo ulogovani (AppShell + useRequireAdmin)
    api/**/route.ts          HTTP ulaz → server/services
    uploads/[...path]/route.ts   otpremljene slike sa diska
    sitemap.ts · robots.ts · global-error.tsx

  components/<kategorija>/<Komponenta>/
    Komponenta.tsx           default export
    Komponenta.styles.ts     next-yak styled elementi (server i klijent, bez 'use client')
    Komponenta.yak.ts        (opciono) vrednosti koje stil čita u build-u
    Komponenta.types.ts      <Komponenta>Props
    Komponenta.constants.ts  (opciono)
    index.ts                 export { default } + export type *
  components/index.ts        barrel design system-a

    foundations/ buttons/ inputs/ data-display/ feedback/ navigation/
    overlays/ media/ sections/ cards/ layout/          ← design system
    home/ projects/ notes/ contact/ errors/           ← domeni javnog sajta
    admin/<domen>/                                     ← domeni admin-a

  modals/                    ModalRoot, shared/, <ImeModala>/
  constants/                 index.ts, routes.ts, api.ts, env.ts, http.ts, modals.ts,
                             navigation.ts, icons.ts, layout.ts, cookies.ts, <domen>.ts,
                             theme/, i18n/
  store/                     index.ts (makeStore), rootReducer.ts, api/, slices/, listeners/, persistence/
  hooks/                     useStore.ts, useModal.ts, … generički; <domen>/, admin/<domen>/
  helpers/                   čiste funkcije, jedan fajl po temi
  providers/                 StoreProvider, I18nProvider, ThemeProvider, StyledRegistry, SessionProvider
  styles/                    tokens.yak.ts, global.ts, animations.ts, mixins.ts
  types/                     domenski modeli (oblici API odgovora) + use-intl.d.ts
  schemas/                   zod šeme — ISTA šema validira formu na klijentu i telo zahteva na serveru
  i18n/                      routing.ts, navigation.ts, request.ts (next-intl)
  server/                    SAMO server — vidi docs/17-backend.md
    env.ts db.ts http.ts cache.ts rateLimit.ts request.ts log.ts markdown.ts
    auth/ mail/ email-verification/ uploads/ cv/
    services/<domen>.ts       logika + serializeri; *.db.test.ts pored
  test/                      setup za Vitest (jsdom, test baza)
  proxy.ts                   jezik, CSP nonce, security headeri, admin. host
```

## Pravila

- **Prazan folder se ne pravi unapred.** Kategorija nastaje sa prvom komponentom.
- **`app/` ne sadrži JSX logiku.** `page.tsx` pročita podatke, napravi metapodatke i renderuje
  jedan View. Sve ostalo je u `components/`.
- **Barrel postoji na nivou foldera komponente (`index.ts`) i na nivou `constants/`,
  `hooks/`, `helpers/`, `store/api/`.** Importuje se najkraćom putanjom koju barrel daje:
  `@/components/buttons/Button`, `@/hooks/contact`, `@/constants/routes`.
- **Test stoji pored onoga što testira:** `Button.test.tsx` u folderu `Button/`,
  `verifyEmail.test.ts` pored `verifyEmail.ts`.
