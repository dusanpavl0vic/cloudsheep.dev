---
description: Prikazuje šta je u kom chunku, najveće zavisnosti, duplikate i uticaj barrel fajlova
argument-hint: [opciono: ruta]
allowed-tools: Read, Grep, Glob, Bash(pnpm build:*), Bash(pnpm size:*), Bash(node scripts/check-size.mjs:*), Bash(ls:*), Bash(du:*), Bash(gzip:*)
---

Analiziraj JS javnih ruta (`$ARGUMENTS` ako je data, inače `/`, `/projects`, `/notes`, `/contact`).

## Prvo pročitaj

`docs/07-performance.md` §6, ADR 0014 (budžet 200 KB gzip po ruti) i ADR 0015 (next-yak).

## Postupak

```bash
SOURCE_MAPS=1 pnpm build
node scripts/check-size.mjs --verbose     # pravi Chromium, broji svaki chunk do `load`
```

Brojanje `<script>` tagova u HTML-u laže: App Router dovlači chunkove u runtime-u. Meri se
samo kroz `scripts/check-size.mjs`. Sourcemape u `.next/static/chunks/*.map` kažu šta je u
kom chunku.

## Šta prijaviti

1. **Chunkovi** — ime, veličina raw i gzip, koji moduli su unutra
2. **Najveće zavisnosti** — top 10 po doprinosu, kao procenat initial bundle-a
3. **Duplikati** — isti paket u više chunkova, ili dve verzije istog paketa u lock fajlu
4. **Šta ne bi smelo na javnoj ruti** — RTK Query i `store/api/admin/*`, zod resolver van
   lenjog importa, modali van `lazy`, `marked`, `constants/theme` vrednosti (tokeni se čitaju
   samo statično)
5. **Uticaj barrel fajlova** — da li neki barrel vuče module koji se ne koriste

## Referentni sastav

React 19 + Next 16 runtime je ~128 KB gzip i ne može se smanjiti. Poslednje merenje
(ADR 0014): `/` 189,8 · `/projects` 180,4 · `/notes` 180,4 · `/contact` 198,0 KB.
Odstupanje od ovoga je nalaz vredan objašnjenja.

## Izlaz

Tabela chunkova, pa tabela zavisnosti, pa lista nalaza sa procenjenom uštedom u KB.

Ako analiza iz sourcemap-a ne daje jasan odgovor, reci to — ne nagađaj.
