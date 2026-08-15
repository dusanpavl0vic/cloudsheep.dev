---
description: Prikazuje šta je u kom chunku, najveće zavisnosti, duplikate i uticaj barrel fajlova
argument-hint: [app]
arguments: app
allowed-tools: Read, Grep, Glob, Bash(pnpm build:*), Bash(pnpm size:*), Bash(ls:*), Bash(du:*), Bash(gzip:*)
---

Analiziraj bundle `apps/$app`.

## Prvo pročitaj

`docs/07-performance.md` §6 i `docs/adr/0005-barrel-files.md`.

## Postupak

```bash
pnpm build --filter=$app
```

Zatim analiziraj `dist/` i sourcemap-e.

## Šta prijaviti

1. **Chunkovi** — ime, veličina raw i gzip, koji moduli su unutra
2. **Najveće zavisnosti** — top 10 po doprinosu, kao procenat initial bundle-a
3. **Duplikati** — isti paket u više chunkova, ili dve verzije istog paketa u lock fajlu
4. **Šta ne bi smelo u initial chunk** — modal engine, RHF, chart biblioteke, RTKQ ako app
   nema endpointe na prvoj ruti
5. **Uticaj barrel fajlova** — da li neki barrel vuče module koji se ne koriste

## Referentni sastav (baseline `apps/web`)

`react-dom` 37% · `react-router` 28% · `tailwind-merge` 7% · `i18next` 6% · `@reduxjs/toolkit` 5%

Odstupanje od ovoga je nalaz vredan objašnjenja.

## Izlaz

Tabela chunkova, pa tabela zavisnosti, pa lista nalaza sa procenjenom uštedom u KB.

Ako `rollup-plugin-visualizer` ne radi (Vite 8 koristi rolldown, ne rollup — vidi
`docs/16-tooling-ci.md` §1.6), reci to i analiziraj iz sourcemap-a umesto da nagađaš.
