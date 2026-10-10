# ADR 0017 — Jedan image iz CI-ja (GHCR), migracije pri startu kontejnera

> Status: accepted (zamenjuje deo deploy-a iz ADR 0009 i stare infra/COOLIFY.md)
> Datum: 2026-10-10
> Učesnici: Dušan Pavlović

## Context

Do sada je Coolify gradio tri image-a (`api`, `web`, `admin`) **na VPS-u** iz grane `prod`.
Posle prelaska na jednu Next.js aplikaciju (ADR 0009) postoji jedan image. `next build` na
serveru od 4 GB, pored Postgres-a i Coolify-ja, zahteva swap, traje više minuta i ume da
izazove OOM. Ograničenje memorije je deo zahteva vlasnika („poštuj ograničenje memorije").

Migracije je ranije pokretala Coolify pre-deployment komanda, a prvi admin nalog seed.

## Decision

1. **Image gradi GitHub Actions** (`Dockerfile` u korenu, Next `output: 'standalone'`) i
   objavljuje ga na **GHCR** sa tagom grane (`:dev`, `:prod`) i commit-a (`:sha-…`).
   Server ga samo povlači. Coolify resurs je tipa **Docker Image**, a ne „Application → GitHub".
2. **Deploy:** push u `prod` → CI (lint, test nad pravim Postgres-om, build, JS budžet, e2e
   sa Mailpit-om) → image `:prod` → Coolify webhook (secrets `COOLIFY_WEBHOOK`,
   `COOLIFY_TOKEN`). Bez secret-a se deploy pokreće ručno.
3. **Start kontejnera** (`scripts/docker-start.sh`): `prisma migrate deploy` → seed
   `--if-empty` (samo prazna baza) → `exec node server.js`. Pre-deployment komanda ne
   postoji. Jedna instanca, pa nema trke dve replike oko iste migracije.
4. Seed se pakuje esbuild-om u `dist/seed.cjs` (aliasi i `server-only` razrešeni, `next` i
   `@prisma/client` ostaju spoljni). Prisma CLI za migracije je u `/opt/prisma`, jer ga
   standalone ne prati.
5. **Memorija:** `mem_limit 768m` u Coolify-ju, `NODE_OPTIONS=--max-old-space-size=384`
   u image-u. Iz standalone-a su izbačeni sharp (slike se ne optimizuju) i Prisma wasm/edge
   runtime-ovi.
6. Postojeća baza ostaje. Nove migracije samo dodaju kolone i tabele, a istorija je ista kao
   na `prod`, `dev` i `feat/vps-migration`. Domen `api.cloudsheep.dev` pokazuje na isti
   kontejner, pa stare apsolutne adrese slika (`/uploads/…`) i dalje rade.

## Consequences

- ✅ Na serveru nema build-a: deploy traje koliko i povlačenje image-a (sekunde do minut),
  bez rizika od OOM-a.
- ✅ Image koji je prošao e2e je bajt-za-bajt isti onaj koji ide u produkciju.
- ✅ Rollback je promena taga (`:sha-<commit>`), čak i bez Coolify istorije.
- ⚠️ GHCR paket mora biti javan ili server mora imati login (`infra/COOLIFY.md` §0).
- ⚠️ `NEXT_PUBLIC_*` je u image-u: promena domena traži nov image, a ne restart.
- ⚠️ Seed pri svakom startu bi vratio obrisane zapise, pa radi samo nad praznom bazom
  (`--if-empty`). Ručni seed: `node dist/seed.cjs`.
- ⚠️ Migracija koja padne obara start kontejnera. Coolify zadržava stari kontejner, a uzrok
  je u logu. Migracije zato moraju biti unazad kompatibilne.
