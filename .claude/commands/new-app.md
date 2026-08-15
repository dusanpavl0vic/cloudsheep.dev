---
description: Skafolduje novu aplikaciju u apps/ sa kompletnim skeletom, config presetima, budžetima i CI unosom
argument-hint: [name]
arguments: name
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm install:*), Bash(pnpm build:*), Bash(pnpm lint:*)
---

Napravi novu aplikaciju `apps/$name`.

## Prvo pročitaj

- `docs/17-adding-new-app.md` — kompletan postupak
- `docs/02-folder-structure.md` — stablo
- `docs/16-tooling-ci.md` §1 — pinovane verzije

## Provera pre pisanja

Nova app se pravi kada postoji **odvojena publika ili odvojen deploy ciklus**.
Nova sekcija u postojećoj app-i je feature, ne app. Ako nisi siguran — reci i stani.

## Koraci

1. Skelet iz `docs/17` §1 — bez praznih foldera koje app još ne koristi
2. `package.json`: **verzije uvek `catalog:`**, interni paketi uvek `workspace:*`
3. Config se **nasleđuje, ne kopira**:
   - `vite.config.ts` → `createViteConfig({ appName: '$name' })`
   - `tsconfig.json` → `extends: "@app/typescript-config/app.json"`
   - `eslint.config.js` → `createAppConfig({ tsconfigRootDir: import.meta.dirname })`
   Ako moraš da prepišeš nešto iz preseta — preset fali, prijavi to umesto da praviš izuzetak.
4. Budžeti **od prvog commita**: `.size-limit.json` i `lighthouserc.json`
5. Registracija: CI matrix, root `README.md`, `docs/00-overview.md`
6. `apps/$name/CLAUDE.md` sa specifičnostima app-e
7. Bar jedan e2e smoke test
8. `vercel.json` sa `pnpm install --frozen-lockfile` i `npx turbo-ignore`

## Acceptance

- `pnpm install` prolazi
- `pnpm dev --filter=$name` diže app
- `pnpm build --filter=$name`, `pnpm lint`, `pnpm typecheck`, `pnpm test` prolaze
- `pnpm size --filter=$name` prolazi

Na kraju reci šta korisnik mora ručno: Vercel projekat na dashboardu (root directory `apps/$name`).
