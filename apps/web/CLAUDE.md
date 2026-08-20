# apps/web

Javni marketinški sajt **cloudsheep.dev**. Statičan sadržaj, bez autentikacije,
bez backenda (za sada).

Root pravila važe — vidi `/CLAUDE.md` i `docs/`. Ovde su samo specifičnosti ove app-e.

## Šta je posebno

**Ovo je jedina app u repou koja se meri Lighthouse-om pred stvarnim korisnicima.**
Baseline pre monorepo migracije: **desktop 100 / mobile 92**, FCP 0.5 s, LCP 0.6 s, 337 KiB.

Svaka izmena koja obori te brojke mora imati obrazloženje u PR-u.

```bash
pnpm build && pnpm --filter web preview                # Lighthouse na :4173
```

**Meri se samo produkcijski build.** Dev server servira nemitifikovane ESM module sa
react-refresh-om — Lighthouse tamo pokazuje FCP od 13 s, što nema veze sa stvarnošću.

> `--filter` ide **ispred** imena skripte kad je skripta samo u paketu (`pnpm --filter web
preview`). Oblik `pnpm preview --filter=web` radi samo za skripte koje postoje i u korenu
> (`dev`, `build`, `test`), gde `--filter` zapravo prima turbo, a ne pnpm.

**Lokalni `vite preview` NE primenjuje nginx config** — dakle nema CSP-a ni ostalih headera.
Za njih je test produkcioni image: `docker compose -f infra/docker-compose.yml up --build web`,
pa `curl -I localhost:8080`. Lokalno se proverava sve ostalo: izgled,
Lighthouse Performance/A11y/SEO, `robots.txt`, `sitemap.xml`, `og.png`.

**Lighthouse pokretati u incognito prozoru sa isključenim ekstenzijama.** Jedno merenje je već
palo na tome: Best Practices 54, od čega je 284.9 KiB „neiskorišćenog JS-a" bila Adobe Acrobat
ekstenzija, a ne sajt.

## Budžet

| Stavka     | Limit           | Trenutno     |
| ---------- | --------------- | ------------ |
| Initial JS | **158 KB gzip** | 157.0        |
| CSS        | 20 KB gzip      | 13.6         |
| Po ruti    | 60 KB gzip      | 17.2 (`env`) |

> **Zašto 158.** Brend marka je 2026-08-19 zamenjena isporučenim crtežom iz Figme. On je
> bogatiji od ranijih: šest putanja, 4664 znaka posle zaokruživanja na 2 decimale, što je
> **~2.1 KB gzip**. Rolldown ga izdvaja u zaseban `Logo` chunk (3.12 KB sa `Logo` i
> varijantama), a taj chunk je u početnom učitavanju jer marku nose zaglavlje i podnožje.
>
> **Nema šta da se očisti.** Ranije su u ljusci stajale dve marke; obe su obrisane i ostala
> je tačno jedna. Zaokruživanje sa 10 na 2 decimale već je vratilo 24% putanje (razlika
> 0.12% piksela pri renderu na 600px, izmereno). Na 1 decimalu razlika skače na 1.19% i
> ivice se vidno pomeraju, pa je to granica.
>
> **Put ispod 155 ako ikad zatreba:** marka se izmesti u `public/logo.svg` i crta kroz
> CSS `mask` sa `background: currentColor`. Tema i dalje radi, JS trošak pada na nulu, cena
> je jedan keširan zahtev i nova mehanika u kodu. Nije urađeno jer bi zbog jednog KB uvelo
> obrazac koji nigde drugde ne postoji.
>
> Traka napretka i 404 stranica **nisu** dodale ništa — izmereno pre i posle, oba puta 154.7.

Meri `node scripts/check-size.mjs` (= `pnpm size`), i to je deo `pnpm validate`.

> **Zašto 155, a ne 150.** Do sada niko nije merio tačno: `pnpm size` je zvao `turbo run size`,
> nijedan workspace nije definisao `size`, pa je turbo pokretao samo `build` i javljao uspeh —
> `validate` je „prolazio" proveru budžeta a da ništa nije izmerio. Ručna merenja su brojala
> pet od jedanaest fajlova u početnom učitavanju i davala lažnih ~148 KB. Stvarna vrednost je
> bila **166.9 KB**, dakle 150 nije bilo dostignuto ni onda kad se mislilo da jeste.
>
> Posle čišćenja (zod van shell-a, lucide van ljuske) stvarna vrednost je 150.4 KB. Granica je
> podignuta na 155 da bude **broj koji se poštuje**, umesto broja koji se ne meri.

**Šta ulazi u „initial" — čita se iz `dist/index.html`**, ne iz imena fajlova: entry script
plus svaki `modulepreload`. Browser ih povuče pre prvog kadra, pa svi ulaze u budžet.

Sastav početnog učitavanja (gzip): `react-vendor` 85.9 · `index` 38.5 · `src` 17.4 ·
`redux-vendor` 9.9 · `useDevice` 1.6 · `routes` 1.2 · ostalo ~0.5.

**Pun stack (RHF, modal engine, RTKQ) je prisutan i ovde**, ali sve mora biti lazy:
modal registry se učitava tek na prvo otvaranje modala, RHF tek na `/contact` ruti,
RTKQ u zasebnom chunk-u. Ako nešto od toga uđe u initial chunk — budžet pada.

> Ovo se već desilo jednom, i to nevidljivo: `themeSlice` je uvezao `zod` da proveri jedan
> string (`'light' | 'dark'`), pa je cela biblioteka (15.5 KB) sedela u početnom učitavanju.
> Pouka nije „ne koristi zod" nego: **zavisnost u store slice-u je zavisnost u ljusci.**

## Feature-i

| Feature    | Sadržaj                                                                          |
| ---------- | -------------------------------------------------------------------------------- |
| `landing`  | 8 sekcija: hero, insight, studio, services, process, work, pricing, faq, contact |
| `projects` | lista + detalj (case study)                                                      |
| `contact`  | forma (RHF + zod)                                                                |
| `uses`     | alati i oprema                                                                   |
| `notFound` | 404                                                                              |

## Sadržaj je podatak, ne markup

Ponavljajući sadržaj (usluge, koraci procesa, cenovni paketi, FAQ) **nikad se ne piše kao
ponovljeni JSX**:

1. Sadržaj je niz u `<feature>.constants.ts` — svaki unos ima `id` i **i18n ključeve**
   (`titleKey`, `descriptionKey`), nikad gotov tekst
2. Sekcija taj niz renderuje kroz `.map()` u univerzalnu komponentu
3. Vizuelne razlike idu kao **podatak** (`tone: 'accent'`, `featured: true`) koji se
   prosleđuje kao cva varijanta

Dodavanje nove usluge = jedan objekat u nizu + dva prevoda. Bez diranja JSX-a.

## Fontovi

Self-hostovani u `public/fonts/`, deklaracije u `src/styles/fonts.css`.
**Nikad `fonts.googleapis.com`** — render-blocking third-party zahtev.

- DM Sans (`font-sans`), Space Grotesk (`font-heading`, automatski na h1–h6), JetBrains Mono (`font-mono`)
- Subset **latin + latin-ext** — bez `latin-ext` srpski č/ć/š/ž/đ padaju na fallback font
- Varijabilni font = **jedan** fajl za sve težine (`font-weight: 400 700`); naivno skidanje
  sa Google-a daje 18 fajlova / 572 KB umesto 6 / 174 KB — deduplikuj po hešu
- `font-display: swap`, `preload` samo za prvi ekran

## Prvo platforma, pa biblioteka

FAQ akordeon koristi native `<details>`/`<summary>` — bez `useState`-a, bez `useEffect`-a,
bez Radix paketa, uz besplatnu pristupačnost i rad bez JavaScript-a.

Ovo je pravilo, ne slučajnost: kada platforma rešava problem, ne dodaje se zavisnost.

## SVG iz Figme

Pre upotrebe: skloni `<rect>` pozadinu · boje → `currentColor` (tema radi sama) ·
koordinate zaokruži na 2 decimale (Figma piše 10 — ušteda ~17%).
Nekvadratni SVG: `h-* w-auto`, ne `size-*`.

## Deploy

`cloudsheep.dev`, Coolify resurs `web`, image iz `infra/docker/web.Dockerfile`
(nginx koji servira `dist/`, uz SPA fallback i security headere iz `infra/nginx/spa.conf`).
Vidi `/DEPLOYMENT.md` i `infra/COOLIFY.md`.

## Checklist pre PR-a

- [ ] `pnpm validate` prolazi
- [ ] Lighthouse na produkcijskom buildu nije pao ispod baseline-a
- [ ] `pnpm size` prolazi (meri stvarno početno učitavanje iz `dist/index.html`)
- [ ] Novi sadržaj je podatak u `.constants.ts`, ne ponovljeni JSX
- [ ] Novi tekst je u `sr.json` i `en.json`
- [ ] `pnpm e2e` prolazi ako je diran mobilni panel, jezik ili SEO fajl
