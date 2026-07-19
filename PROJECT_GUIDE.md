# CloudSheep — Vodič za frontend projekat

> Ovaj fajl je izvor istine za arhitekturu, konvencije i pravila projekta.
> Svaka nova komponenta, feature ili izmena mora da prati ova pravila.
> Kada se donese nova arhitektonska odluka, ovaj fajl se ažurira u istom trenutku.

---

## 1. Tehnološki stek

| Oblast | Tehnologija | Zašto |
|---|---|---|
| Framework | **React 19 + TypeScript** | Standard za biznis aplikacije, ogroman ekosistem, tipska sigurnost |
| Build alat | **Vite** | Najbrži dev server i build, jednostavna konfiguracija |
| Server state | **RTK Query (deo Redux Toolkit-a)** | Fetch, keširanje, refetch, loading/error stanja — **bez useEffect-a** |
| Klijentski state | **Redux Toolkit** | Standard za biznis aplikacije; slices za temu i globalni UI state |
| Rutiranje | **React Router v7** | Standard za SPA rutiranje |
| Prevodi | **i18next + react-i18next** | Podrška za SR/EN, detekcija jezika, čuvanje izbora u localStorage |
| Stilovi | **Tailwind CSS v4** | Utility-first, dizajn tokeni kao CSS varijable, svetla/tamna tema |
| UI komponente | **shadcn/ui pristup** | Komponente se kopiraju u projekat — potpuno vlasništvo i sloboda izmene; Radix primitivi = pristupačnost |
| Ikonice | **lucide-react** | Standard uz shadcn, konzistentan set |
| Forme | **react-hook-form + zod** | Performantne forme + validacija sa tipovima |
| Lint/format | **ESLint (flat config) + Prettier (+ tailwind plugin)** | Konzistentan kod i sortirane Tailwind klase |

---

## 2. Ključni principi

### 2.1. Što manje `useEffect`-a

`useEffect` nije zabranjen, ali je **poslednje utočište, ne prvi alat**. Pre nego
što ga upotrebiš, proveri da li neka od alternativa rešava problem — u 90% slučajeva
rešava. Za izvedene vrednosti uvek koristi izračunavanje u renderu ili `useMemo`,
nikad `useEffect` + `useState`. Umesto useEffect-a:

| Potreba | Rešenje umesto useEffect |
|---|---|
| Dohvatanje podataka sa API-ja | `useXxxQuery` hook iz RTK Query |
| Slanje podataka (POST/PUT/DELETE) | `useXxxMutation` hook iz RTK Query |
| Reakcija na korisničku akciju | Event handler (`onClick`, `onSubmit`...) |
| Izvedena vrednost iz state-a/props-a | Izračunaj tokom rendera; `useMemo` ako je izračunavanje skupo — **nikad** `useEffect` + `useState` |
| Čitanje globalnog state-a | `useAppSelector` (Redux) |
| Side-effect pri promeni state-a | Listener middleware (vidi `store/index.ts`) |
| Inicijalizacija pri startu aplikacije | Module-level kod pre `createRoot` (vidi `main.tsx`, `i18n/index.ts`) |

ESLint je konfigurisan da prijavi upozorenje pri importu `useEffect` — upozorenje je
podsetnik da prvo probaš alternativu. Ako je `useEffect` zaista opravdan (npr.
integracija sa ne-React bibliotekom, subscribe na browser evente), slobodno ga
koristi uz kratak komentar zašto je neophodan.

### 2.2. Komponenta = folder (struktura + stil + konstante razdvojeni)

Svaka komponenta živi u svom folderu. Stil se piše Tailwind klasama, a **definicije
varijanti** (vizuelne varijante, veličine) se izdvajaju u poseban `.variants.ts`
fajl preko `cva` (class-variance-authority) — time su struktura i stil razdvojeni:

```
Button/
├── Button.tsx              # struktura (JSX + logika)
├── Button.variants.ts      # stil — cva varijante (variant, size...)
├── Button.constants.ts     # ostale konstante komponente (ako postoje)
└── index.ts                # javni export (barrel)
```

- **Sav stil komponente živi u `.variants.ts` — i kad komponenta nema varijante.**
  Tada je fajl samo `cva('...klase...')` bez `variants` objekta (vidi `Input.variants.ts`,
  `Card.variants.ts`). U `.tsx` fajlu komponente nema Tailwind class stringova —
  samo `cn(xxxVariants(...), className)`. Stranice/feature komponente smeju inline
  utility klase isključivo za **layout kompoziciju** (`flex`, `gap`, `max-w`...),
  nikad za vizuelni stil.

- Dve vrste komponenti:
  - `src/components/ui/` — **primitivi** (shadcn/ui): Button, Input, Card, Dialog...
    Kopiraju se u projekat i slobodno menjaju.
  - `src/components/` — **naše kompozitne komponente**: ThemeToggle, LanguageSwitcher...
- Tailwind klase koriste **isključivo semantičke tokene** (`bg-primary`,
  `text-muted-foreground`, `border-border`) — nikad sirove boje (`bg-blue-500`)
  ni proizvoljne vrednosti (`text-[#333]`).
- Nova shadcn komponenta se dodaje sa `npx shadcn@latest add <naziv>`, a zatim se
  **preuredi u folder strukturu** iznad (fajl → folder + variants + index).
- Import komponente uvek preko barrel-a: `import { Button } from '@/components/ui/Button'`.

### 2.3. Male, izolovane, univerzalne komponente

- Svaki element koji se ponavlja (dugme, input, badge, kartica...) je **posebna komponenta**.
- Komponenta radi jednu stvar. Ako fajl pređe ~150 linija, razmisli o podeli.
- Nema poslovne logike u UI komponentama — one primaju props i emituju evente.
- **Ponavljajući šabloni se izdvajaju u univerzalne prop-driven komponente** umesto
  kopiranja JSX-a. Primeri: `Section` (naslov + sadržaj, `layout` varijanta row/column),
  `PageHeader` (naslov + podnaslov). Ponašanje i izgled se kontrolišu **propovima /
  cva varijantama**, ne dupliranjem koda.

### 2.4. Konstante odvojene od koda

- **Globalne konstante** → `src/constants/` (rute, config, storage ključevi).
- **Dizajn tokeni** (boje, font, radijusi) → CSS varijable u `src/styles/global.css`,
  mapirane na Tailwind klase kroz `@theme inline`.
- **Varijante komponente** → `Komponenta.variants.ts` (cva).
- **Ostale konstante komponente** → `Komponenta.constants.ts`.
- Zabranjeni su "magični stringovi/brojevi" po kodu — sve ima imenovanu konstantu.

### 2.5. Feature-first organizacija

Poslovna logika se grupiše po funkcionalnosti u `src/features/<naziv>/`.
Feature može da ima svoje `components/`, `<naziv>Api.ts`, `types.ts` — sve što
koristi samo on. Ono što dele dva ili više feature-a seli se u `src/components/`,
`src/lib/` ili `src/hooks/`.

### 2.6. Sadržaj je podatak, ne markup

Ponavljajući sadržaj (liste usluga, koraci procesa, cenovni paketi, FAQ) **nikad se
ne piše kao ponovljeni JSX**. Umesto toga:

1. Sadržaj se opisuje kao niz u `<feature>.constants.ts` — svaki unos ima `id` i
   **i18n ključeve** (`titleKey`, `descriptionKey`...), nikad gotov tekst.
2. Sekcija taj niz renderuje kroz `.map()` u univerzalnu komponentu.
3. Vizuelne razlike među unosima idu kao **podatak** (`tone: 'accent'`,
   `featured: true`) koji se prosleđuje kao cva varijanta.

Dodavanje nove usluge ili paketa = jedan objekat u nizu + dva prevoda. Bez diranja
JSX-a. Primer: `src/features/landing/landing.constants.ts`.

### 2.7. Prvo platforma, pa biblioteka

Kada platforma rešava problem, ne dodaje se zavisnost. FAQ akordeon koristi native
`<details>`/`<summary>` — otvaranje radi browser, bez `useState`-a, bez `useEffect`-a
i bez Radix paketa, uz besplatnu pristupačnost i rad bez JavaScript-a.

---

## 3. Struktura projekta

```
src/
├── app/                    # Sastavljanje aplikacije
│   ├── App.tsx             # Root komponenta (RouterProvider)
│   ├── AppProviders.tsx    # Svi provideri (Redux Provider...)
│   └── router.tsx          # Definicija ruta
├── components/
│   ├── ui/                 # primitivi: Button, Input, Label, Card,
│   │   └── <Ime>/          #   Badge, Container, Accordion (vidi 2.2)
│   └── <Ime>/              # naše univerzalne komponente:
│                           #   SectionBlock, Eyebrow, Logo, StatItem, TagList,
│                           #   DisciplineRow, ProcessCard, WorkItem, PricingCard,
│                           #   SiteHeader, SiteFooter, ThemeToggle, LanguageSwitcher
├── constants/              # Globalne konstante
│   ├── config.ts           # App config (naziv, API URL iz env-a)
│   ├── navigation.ts       # SECTION_IDS, MAIN_NAV, FOOTER_NAV, kontakt
│   ├── routes.ts           # Putanje ruta
│   └── storageKeys.ts      # localStorage ključevi
├── features/               # Funkcionalnosti (feature-first)
│   └── landing/            # landing stranica
│       ├── LandingPage.tsx        # slaže sekcije redom
│       ├── landing.constants.ts   # sav sadržaj kao podaci (vidi 2.6)
│       └── components/<Sekcija>/  # HeroSection, StudioSection, ServicesSection,
│                                  # ProcessSection, WorkSection, PricingSection,
│                                  # FaqSection, ContactSection
├── hooks/                  # Deljeni custom hookovi
├── i18n/                   # Internacionalizacija
│   ├── index.ts            # i18next setup + LANGUAGES konstante
│   └── locales/
│       ├── en.json         # engleski prevodi
│       └── sr.json         # srpski prevodi
├── layouts/                # Layout komponente (MainLayout sa headerom)
├── lib/                    # Infrastruktura (cn — spajanje Tailwind klasa...)
├── store/                  # Redux store
│   ├── index.ts            # configureStore + listener middleware + RootState
│   ├── hooks.ts            # useAppSelector / useAppDispatch (tipizirani)
│   ├── api/baseApi.ts      # RTK Query bazni API (createApi)
│   └── slices/             # Redux slices (themeSlice...)
├── styles/
│   └── global.css          # Tailwind import + dizajn tokeni + svetla/tamna tema
├── types/                  # Deljeni TypeScript tipovi
└── main.tsx                # Entry point
```

---

## 4. Teme (svetla / tamna) i dizajn tokeni

- **Izvor dizajna je Figma fajl `cloudSheep.dev`** — boje i fontovi se izvlače odatle
  i žive kao CSS varijable u `global.css`. Paleta: Ecru White `#F3F3E0` (pozadina),
  Bianca `#FBFBF2` (kartice), Downriver `#0B1F45` (tekst), Chathams Blue `#133E87`
  (primarna), Pigeon Post `#B9C4DE` (sekundarna), Tulip Tree `#E8A838` (akcenat),
  Jungle Green `#2DBE7E` (uspeh), Moon Mist `#D8D8C4` / Ash `#C2C2AC` (ivice/input).
- **Fontovi iz dizajna:** DM Sans (`font-sans`, tekst), Space Grotesk (`font-heading`,
  naslovi — automatski na h1–h6), JetBrains Mono (`font-mono`). Učitavaju se u `index.html`.
- Pored standardnih shadcn tokena postoje i `success` / `success-foreground`
  (`bg-success`...), a `accent` je narandžasti brend akcenat — **ne** koristi se
  za hover neutralnih elemenata (za to je `muted`).
- **Inverzna površina** — tamnoplave trake (CTA banner, footer) koje ostaju tamne i
  u svetloj temi: `bg-inverse`, `text-inverse-foreground`, `text-inverse-muted`,
  `border-inverse-border`. Komponente koje mogu da stoje na obe podloge dobijaju
  cva varijantu `tone: 'default' | 'inverse'` (vidi `Eyebrow`, `Logo`, `SectionBlock`)
  umesto da se pišu dva puta.
- Svi tokeni su CSS varijable u `src/styles/global.css`:
  - `:root` → svetla tema (podrazumevana)
  - `[data-theme="dark"]` → tamna tema (override samo boja)
  - `@theme inline` mapira varijable na Tailwind klase (`bg-background`, `text-primary`...)
  - `@custom-variant dark` omogućava `dark:` prefiks vezan za `data-theme` atribut
- Tema se menja postavljanjem `data-theme` atributa na `<html>` — to radi
  **listener middleware** u `store/index.ts` (ne useEffect) i čuva izbor u localStorage.
- Pri prvom ulasku koristi se sistemska preferenca (`prefers-color-scheme`).
- **Pravilo:** komponente nikad ne znaju koja je tema aktivna — koriste semantičke
  klase (`bg-card`, `text-foreground`) i tema "samo radi".

## 5. Prevodi (SR / EN)

- Svi tekstovi u UI idu kroz `useTranslation()` → `t('home.title')`.
- **Zabranjen je hardkodovan tekst u JSX-u.** Svaki novi string se dodaje u
  **oba** fajla: `i18n/locales/sr.json` i `i18n/locales/en.json`.
- Ključevi su ugnježdeni po feature-u: `home.title`, `common.save`, `theme.switchToDark`.
- Izbor jezika se čuva u localStorage; podrazumevani jezik je srpski.

## 6. Rad sa API-jem (RTK Query)

- Postoji jedan bazni API: `src/store/api/baseApi.ts` (`createApi` + `fetchBaseQuery`,
  baseUrl iz `APP_CONFIG.apiUrl`).
- Svaki feature dodaje svoje endpointe kroz **`baseApi.injectEndpoints`** u svom
  fajlu `features/<naziv>/<naziv>Api.ts` i exportuje generisane hookove
  (`useGetXxxQuery`, `useCreateXxxMutation`...).
- Komponente nikad ne zovu `fetch` direktno — koriste isključivo RTK Query hookove.
- Keš invalidacija ide preko `tagTypes` / `providesTags` / `invalidatesTags`.

## 7. Konvencije imenovanja

| Šta | Konvencija | Primer |
|---|---|---|
| Komponente i folderi komponenti | PascalCase | `Button/`, `ThemeToggle.tsx` |
| Hookovi | camelCase sa `use` prefiksom | `useDebounce.ts` |
| Redux slices | camelCase sa `Slice` sufiksom | `themeSlice.ts` |
| RTK Query API fajlovi | camelCase sa `Api` sufiksom | `homeApi.ts` |
| Varijante komponente | `<Ime>.variants.ts` | `Button.variants.ts` |
| Konstante | SCREAMING_SNAKE_CASE | `STORAGE_KEYS` |
| Tailwind klase | samo semantički tokeni | `bg-primary`, ne `bg-blue-500` |
| Prevodilački ključevi | camelCase, ugnježdeni | `home.emailLabel` |
| Ostali fajlovi | camelCase | `storageKeys.ts` |

- Import putanje uvek preko alias-a `@/` (nikad `../../..`).
- `import type` za tipove (verbatimModuleSyntax je uključen).

## 8. Performanse

**Meri se samo produkcijski build.** `npm run dev` servira nemitifikovane ESM module
sa react-refresh-om — Lighthouse tu pokazuje FCP od 13 s i „duplicated JavaScript",
što nema veze sa stvarnošću. Ispravan postupak:

```bash
npm run build && npm run preview   # pa Lighthouse na http://localhost:4173
```

Referentni rezultat landing stranice: **desktop 100, mobilni 92**
(FCP 0.5 s / LCP 0.6 s desktop; 337 KiB ukupno).

Pravila kojih se držimo:

- **Fontovi se self-hostuju**, nikad preko `fonts.googleapis.com`. Google veza je
  render-blocking third-party zahtev. Fajlovi su u `public/fonts/`, deklaracije u
  `src/styles/fonts.css`, uvezene iz `global.css`.
- **Varijabilni font = jedan fajl za sve težine.** Google isporučuje isti fajl za
  svaku težinu; ako se skidaju naivno, dobije se 18 fajlova / 572 KB umesto
  6 fajlova / 174 KB. Deduplikuj po hešu i koristi `font-weight: 400 700`.
- Podskupovi: **latin + latin-ext** (latin-ext nosi č, ć, š, ž, đ — bez njega se
  srpski tekst renderuje fallback fontom).
- `font-display: swap` uvek; `<link rel="preload">` samo za fontove prvog ekrana.
- **Ne uključuj biblioteku dok se ne koristi.** RTK Query je bio u store-u bez
  ijednog endpointa i nosio ~40 KB. Vraća se u store tek uz prvi endpoint.
- **SVG iz Figme se čisti pre upotrebe**: skloni `<rect>` pozadinu, boje zameni sa
  `currentColor` (tema radi sama), zaokruži koordinate na 2 decimale (Figma piše 10
  — ušteda ~17% bez vidljive razlike).
- Za nekvadratne SVG-ove koristi `h-* w-auto`, ne `size-*` (inače ostaje prazan prostor).
- Slike uvek sa `width`/`height` ili fiksnim aspect-ratio kontejnerom — čuva CLS na 0.

Šta trenutno najviše nosi u bundle-u (mereno iz sourcemap-a): `react-dom` 37%,
`react-router` 28%, `tailwind-merge` 7%, `i18next` 6%, `@reduxjs/toolkit` 5%.
React Router nosi 28% zbog **jedne** rute — kada se bude biralo šta da se skrati,
tu je najveći dobitak.

## 9. Komande

```bash
npm run dev                        # dev server (http://localhost:5173)
npm run build                      # typecheck + produkcioni build
npm run preview                    # pregled produkcionog builda
npm run lint                       # ESLint provera
npm run format                     # Prettier formatiranje
npx shadcn@latest add <naziv>      # dodavanje shadcn komponente (zatim preurediti u folder)
```

## 10. Checklist za novu komponentu

1. Folder `src/components/ui/<Ime>/` (primitiv), `src/components/<Ime>/` (kompozitna)
   ili unutar feature-a ako je samo njegova
2. `<Ime>.tsx` — struktura; `<Ime>.variants.ts` — cva varijante ako ih ima
3. `<Ime>.constants.ts` ako ima ostalih konstanti
4. `index.ts` barrel export
5. Svi tekstovi kroz `t(...)`, dodati u `sr.json` i `en.json`
6. `useEffect` samo ako nema alternativu (izvedene vrednosti → render/`useMemo`)
7. Samo semantičke Tailwind klase — bez sirovih boja i magičnih vrednosti
