# ADR 0009 — Jedna Next.js aplikacija umesto dva SPA-a i Express-a

> Status: accepted
> Datum: 2026-10-08
> Učesnici: Dušan Pavlović

## Context

Do sada: `apps/web` i `apps/admin` (Vite SPA, React Router, nginx) i `apps/api` (Express 5 +
Prisma), tri kontejnera na VPS-u od 4 GB.

Search Console (export 2026-10-08) je pokazao cenu SPA-a:

- 14 neindeksiranih adresa, od 19 poznatih; 3 od 4 studije slučaja nikad nisu ni posećene.
- Googlebot je 20.9, 27.9. i 3.10. renderovao stranicu koja je pala jer API nije odgovorio
  na vreme — u HTML-u je ostao „Unexpected Application Error!" sa stack trace-om, a Google je
  iz njega izvukao 5 „adresa" oblika `react-vendor-….js:9:70789`.
- Nepostojeće adrese su vraćale 200 i `canonical` početne (soft 404), `/contact/` je bio
  duplikat; `scripts/build-seo-pages.mjs` je krpio samo `<head>`.
- Nov projekat iz admin-a nije postojao za pretraživač do sledećeg rebuild-a.

Uz to: CORS i kolačići između tri poddomena, tri Dockerfile-a, i Docker build Vite-a koji se
na serveru sudarao sa 4 GB RAM-a (`infra/SERVER-SETUP.md`).

## Decision

Koristimo **jednu Next.js 16 aplikaciju (App Router, `output: 'standalone'`)** koja sadrži
javni sajt (server komponente), admin panel (`/admin`, klijentski) i API (`/api`, route
handleri nad `src/server/services`). Image se gradi u CI-u i objavljuje na GHCR.

## Consequences

### Pozitivne
- Google dobija pun HTML sa sadržajem, naslovom, `canonical`-om i hreflang-om; nepostojeći
  slug je pravi 404 (`notFound()`); pad baze daje `error.tsx`, nikad stack trace.
- Nov sadržaj iz admin-a je vidljiv odmah (`revalidateTag`), bez rebuild-a.
- Jedan kontejner umesto tri; API na istom poreklu — nema CORS-a ni deljenja kolačića
  između poddomena.
- Nema build-a na VPS-u: image dolazi gotov sa GHCR-a.

### Negativne
- Potpuno prepisivanje (~26k linija); stari kod ostaje samo u git istoriji.
- Server/klijent granica je nova vrsta greške (tajna u klijentskom modulu, neserijalizabilan
  prop). Ublaženo lint pravilom koje zabranjuje `@/server` van servera.
- CSP sa nonce-om (`docs/20-security.md`) čini svaku stranicu dinamičkom — SSR po zahtevu.
  Ublaženo kešom podataka po tagu.
- Next.js runtime je veći od Vite SPA ljuske; JS budžet se meri po ruti, ne po `index.html`.
- Express middleware (helmet, cors, rate-limit, multer) se zamenjuje sopstvenim kodom u
  `src/server/`.

### Neutralne / posledice po proces
- `docs/` je prepisan; `apps/`, `packages/`, turbo i nginx konfiguracija su obrisani.
- Coolify: jedan resurs tipa „Docker Image" umesto tri (`infra/COOLIFY.md`).

## Alternatives considered

| Opcija | Za | Protiv | Zašto odbačena |
|---|---|---|---|
| Ne raditi ništa + nginx popravke (PR #7) | malo posla | SPA i dalje zavisi od JS-a i API-ja u trenutku renderovanja | rešava simptome, ne uzrok |
| Vite SPA + prerender pri buildu | zadržava stek | sadržaj iz baze zastari do rebuild-a; build traži pretraživač | ne rešava dinamički sadržaj |
| Next.js samo za javni sajt | manje posla | ostaju tri kontejnera i CORS | pola rešenja |
| React Router 7 framework mode | blizu postojećem kodu | manji ekosistem za SSR na VPS-u, i dalje poseban API | Next.js je bio izbor korisnika |

## Revisit when

Ako javni JS pređe 200 KB gzip po ruti (ADR 0014) i to ne može da se reši u okviru Next.js-a, ili ako
RSS kontejnera trajno pređe 400 MB.

## Reference

- `docs/01-architecture.md` §2–3, `docs/17-backend.md`, `docs/16-tooling-ci.md` §5
- ADR 0002 (zamenjen ovim)
