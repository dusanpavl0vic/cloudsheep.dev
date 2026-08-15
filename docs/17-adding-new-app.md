# 17 — Dodavanje nove aplikacije

> Status: active | Last review: 2026-08-15

Automatski: **`/new-app <name>`**. Ovaj dokument opisuje šta ta komanda radi i šta proveriti posle.

## Pre nego što počneš

Nova app se pravi kada postoji **odvojena publika ili odvojen deploy ciklus**.
Nova sekcija u postojećoj app-i je feature, ne app. Ako nisi siguran — feature.

## Koraci

### 1. Skelet

```
apps/<name>/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── providers/     StoreProvider, I18nProvider, ErrorBoundary, ModalRoot
│   ├── routes/        router.tsx
│   ├── store/         index.ts, hooks.ts
│   ├── pages/
│   ├── features/
│   ├── components/
│   ├── hooks/
│   ├── lib/           routes.ts, config.ts
│   ├── locales/       common.json, errors.json
│   └── types/
├── e2e/
├── public/
├── index.html
├── vite.config.ts
├── vitest.config.ts
├── lighthouserc.json
├── .size-limit.json
├── vercel.json
├── tsconfig.json
├── package.json
└── CLAUDE.md
```

### 2. `package.json`

```json
{
  "name": "<name>",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "e2e": "playwright test",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "size": "size-limit",
    "lighthouse": "lhci autorun"
  },
  "dependencies": {
    "@app/core": "workspace:*",
    "@app/ui": "workspace:*",
    "@app/i18n": "workspace:*",
    "@app/utils": "workspace:*",
    "@app/hooks": "workspace:*",
    "react": "catalog:",
    "react-dom": "catalog:"
  }
}
```

**Verzije uvek `catalog:`**, interni paketi uvek `workspace:*`.

### 3. Konfiguracija se nasleđuje, ne kopira

```ts
// vite.config.ts
import { createViteConfig } from '@app/vite-config';
export default createViteConfig({ appName: '<name>' });
```

```json
// tsconfig.json
{ "extends": "@app/typescript-config/app.json", "include": ["src"] }
```

```js
// eslint.config.js
import { createAppConfig } from '@app/eslint-config';
export default createAppConfig({ tsconfigRootDir: import.meta.dirname });
```

Ako moraš da prepišeš nešto iz preseta — to je signal da preset fali, ne da app treba izuzetak.

### 4. Registracija u monorepou

- `pnpm-workspace.yaml` — `apps/*` već pokriva
- `turbo.json` — pipeline je zajednički; app-specifični `outputs` samo ako odstupa
- `.github/workflows/ci.yml` — dodaj u matrix
- root `README.md` — red u tabeli app-ova
- [`00-overview.md`](00-overview.md) — red u tabeli app-ova

### 5. Deploy

Novi Vercel projekat:

| Podešavanje | Vrednost |
|---|---|
| Root Directory | `apps/<name>` |
| Install Command | `pnpm install --frozen-lockfile` |
| Build Command | `pnpm build` |
| Output Directory | `dist` |
| Ignored Build Step | `npx turbo-ignore` |

Grane prate postojeću šemu: `dev` → preview, `main` → test, `prod` → production
(vidi `DEPLOYMENT.md`).

### 6. Budžeti od prvog dana

```json
// .size-limit.json
[{ "name": "initial", "path": "dist/assets/index-*.js", "limit": "150 KB" },
 { "name": "css",     "path": "dist/assets/*.css",      "limit": "20 KB" }]
```

Budžet postavljen kasnije je budžet koji se nikad ne postavi.

## Anti-patterns

| ❌ | ✅ |
|---|---|
| kopiranje `vite.config.ts` iz druge app-e | `createViteConfig` preset |
| `"react": "^19.2.8"` u app `package.json` | `"react": "catalog:"` |
| app bez `lighthouserc.json` i `.size-limit.json` | budžeti od prvog commita |
| deljenje koda copy-paste-om iz druge app-e | izdigni u `packages/` |
| nova app za novu stranicu | to je ruta, ne app |
| `apps/<name>/src/utils.ts` | `lib/<imePosla>.ts` |

## Checklist

- [ ] `pnpm install` prolazi, `workspace:*` i `catalog:` korišćeni svuda
- [ ] `pnpm dev --filter=<name>` diže app
- [ ] `pnpm build --filter=<name>` prolazi
- [ ] `pnpm lint`, `pnpm typecheck`, `pnpm test` prolaze za novu app
- [ ] `.size-limit.json` i `lighthouserc.json` postoje i prolaze
- [ ] Dodata u CI matrix
- [ ] Vercel projekat napravljen sa `turbo-ignore`
- [ ] `apps/<name>/CLAUDE.md` napisan
- [ ] Upisana u [`00-overview.md`](00-overview.md) i root `README.md`
- [ ] Bar jedan e2e smoke test
