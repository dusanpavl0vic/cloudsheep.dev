# 16 — Tooling i CI

> Status: active | Last review: 2026-08-15
> Sekcija 1 je rezultat F0 — verifikovana `registry.npmjs.org` upitom 2026-08-15.

## 1. Pinovane verzije

Toolchain: **Node v24.19.0**, **pnpm 11.22.0** (kroz `corepack`).

SPEC (`docs/adr/0000-initial-spec.md` §2) je pisan za TS 5.7 / Vite 6 / ESLint 9 / Router 7 /
Vitest 3. Ekosistem je u međuvremenu otišao nekoliko major verzija dalje. Pravilo iz F0 je
"uzmi noviju i zabeleži" — **osim u dva slučaja gde novije lomi lanac alata**; oba su obrazložena
u §1.5 i nisu stvar ukusa nego peer-dependency ograničenja.

### 1.1 Jezgro

| Paket | Pin | SPEC | Napomena |
|---|---|---|---|
| `typescript` | `6.0.3` | 5.7+ | **namerno ne 7.0.2** — vidi §1.5 A |
| `turbo` | `2.10.10` | — | |
| `vite` | `8.2.1` | 6+ | Vite 8 = rolldown bundler |
| `@vitejs/plugin-react` | `6.0.5` | — | peer traži `vite ^8` |
| `@rolldown/plugin-babel` | `0.2.3` | — | **novo** — peer plugin-react-a, nosi Babel u Vite 8 |
| `@babel/core` | `8.0.1` | — | **novo** — peer `@rolldown/plugin-babel`-a |
| `rolldown` | `1.2.4` | — | **novo** — peer `@rolldown/plugin-babel`-a |
| `babel-plugin-react-compiler` | `1.0.0` | 1.x exact | **exact pin, bez `^`** (SPEC §2) |
| `react` / `react-dom` | `19.2.8` | 19.2.x | ✓ |
| `@types/react` / `@types/react-dom` | `19.2.18` / `19.2.4` | | |
| `@types/node` | `26.2.0` | | |

> SPEC §2 kaže "Babel, ne SWC — Babel je potreban za React Compiler". Namera je očuvana:
> u Vite 8 Babel ulazi kroz `@rolldown/plugin-babel` umesto kroz stari `@vitejs/plugin-react`
> Babel mod. React Compiler radi isto.

### 1.2 Aplikativni sloj

| Paket | Pin | SPEC | Napomena |
|---|---|---|---|
| `react-router` | `8.3.0` | v7 | **major napred** — vidi §1.6 |
| `@reduxjs/toolkit` | `2.12.0` | 2.x | ✓ |
| `react-redux` | `9.3.0` | | |
| `tailwindcss` / `@tailwindcss/vite` | `4.3.3` | v4 | peer podržava `vite ^8` ✓ |
| `class-variance-authority` | `0.7.1` | | nepromenjeno |
| `clsx` / `tailwind-merge` | `2.1.1` / `3.6.0` | | |
| `lucide-react` | `1.31.0` | | **major** — projekat je na `0.511.0`; per-icon import ostaje |
| `react-hook-form` | `7.85.0` | 7.x | ✓ |
| `zod` | `4.4.3` | | **major** — projekat je na `3.25`; vidi §1.6 |
| `@hookform/resolvers` | `5.9.0` | | peer: `zod ^3.25 \|\| ^4` ✓ |
| `i18next` | `26.3.6` | | |
| `react-i18next` | `17.0.11` | | peer traži `i18next >= 26.2.0` |
| `i18next-icu` | `2.4.4` | | |
| `intl-messageformat` | `11.2.13` | — | **novo** — peer `i18next-icu`-a, mora eksplicitno |
| `i18next-browser-languagedetector` | `8.2.1` | | |
| `sonner` | `2.0.8` | | |
| `date-fns` | `4.4.0` | | |
| `@tanstack/react-virtual` | `3.14.9` | | obavezno za liste > 100 stavki |
| `@radix-ui/react-dialog` | `1.1.23` | | mehanika modala |
| `@radix-ui/react-slot` | `1.3.3` | | |
| `react-error-boundary` | `6.1.3` | | |
| `web-vitals` | `6.1.1` | | |

### 1.3 Testiranje

| Paket | Pin | SPEC | Napomena |
|---|---|---|---|
| `vitest` / `@vitest/coverage-v8` / `@vitest/ui` | `4.1.10` | Vitest 3 | peer: `vite ^6 \|\| ^7 \|\| ^8` ✓ |
| `jsdom` | `30.0.1` | | |
| `@testing-library/react` | `16.3.2` | | peer: `react ^18 \|\| ^19` ✓ |
| `@testing-library/user-event` | `14.6.4` | | |
| `@testing-library/jest-dom` | `7.0.1` | | zahteva node >= 22 ✓ |
| `@testing-library/dom` | `10.4.1` | | peer obe TL biblioteke |
| `msw` | `2.15.0` | MSW 2 | ✓ |
| `@playwright/test` | `1.62.1` | | |
| `@axe-core/playwright` | `4.13.0` | | e2e a11y |
| `jest-axe` + `axe-core` | `11.0.0` + `4.13.0` | `vitest-axe` | **zamena** — vidi §1.5 C |

### 1.4 Lint, format, release

| Paket | Pin | SPEC | Napomena |
|---|---|---|---|
| `eslint` / `@eslint/js` | `9.39.5` | ESLint 9 | **namerno ne 10.8.1** — vidi §1.5 B |
| `typescript-eslint` | `8.67.0` | strict-type-checked | peer: `ts >=4.8.4 <6.1.0` |
| `eslint-plugin-react-hooks` | `7.1.1` | v6 | v7 nosi compiler pravila |
| `eslint-plugin-import` | `2.32.0` | | `no-restricted-paths` zone |
| `eslint-plugin-jsx-a11y` | `6.10.2` | | |
| `eslint-plugin-i18next` | `6.1.5` | | `no-literal-string` |
| `eslint-plugin-react-refresh` | `0.5.4` | | |
| `globals` | `17.11.0` | | |
| `prettier` / `prettier-plugin-tailwindcss` | `3.9.6` / `0.8.1` | | |
| `husky` / `lint-staged` | `9.1.7` / `17.3.0` | | |
| `@commitlint/cli` + `config-conventional` | `21.2.2` | | |
| `@changesets/cli` | `3.0.0` | | |
| `size-limit` + `@size-limit/preset-app` | `13.0.3` | | zahteva node ^22.18 \|\| ^24 ✓ |
| `rollup-plugin-visualizer` | `7.1.1` | | ⚠ rizik uz rolldown — vidi §1.6 |
| `@lhci/cli` | `0.15.1` | | |
| `i18next-parser` | `9.4.0` | | |
| `turbo-ignore` | `2.10.10` | | Vercel skip build |

### 1.5 Odstupanja od "uzmi najnovije" — sa razlogom

**A. TypeScript `6.0.3`, ne `7.0.2`.**
`typescript-eslint@8.67.0` deklariše peer `typescript: ">=4.8.4 <6.1.0"`. TS 7 bi ga izbacio iz igre,
a s njim i `strict-type-checked` — koji je po SPEC §19 **glavni mehanizam** za "bez `any`, bez `!`".
Trampa "novi compiler za gubitak type-aware lintinga" je loša. `6.0.3` je najviše što peer dozvoljava.
`react-i18next@17` prihvata `^5 || ^6 || ^7`, pa ne smeta.
*Revidirati kad `typescript-eslint` objavi podršku za TS 7.*

**B. ESLint `9.39.5`, ne `10.8.1`.**
Dva plugina koja SPEC eksplicitno zahteva još ne podržavaju ESLint 10:

| Plugin | peer `eslint` | ESLint 10? |
|---|---|---|
| `eslint-plugin-import@2.32.0` | `^2 … ^9` | ✗ |
| `eslint-plugin-jsx-a11y@6.10.2` | `^3 … ^9` | ✗ |

Postoji `eslint-plugin-import-x@4.17.1` (održavani fork, podržava ESLint 10) i njime bi se rešio prvi
red — ali `jsx-a11y` nema ekvivalent, a on je po SPEC §17 **error nivo**. Uz pnpm strict peer resolution
to znači ili `overrides` laž ili pad instalacije. ESLint 9 je linija na kojoj **ceo** set radi bez laganja:
`typescript-eslint@8.67` (`^8.57 || ^9 || ^10`), `react-hooks@7.1.1` (`… || ^9 || ^10`), `import`, `jsx-a11y`.
SPEC ionako kaže "ESLint 9 flat config". *Revidirati kad `jsx-a11y` objavi podršku za 10.*

**C. `jest-axe@11` umesto `vitest-axe`.**
`vitest-axe@0.1.0` je poslednji put objavljen **2022-10-21** — pre Vitest 1.0, a mi smo na 4.1.10.
Peer mu je `vitest >=0.16.0`, što formalno prolazi, ali paket četiri godine nije diran.
`jest-axe@11.0.0` nema peer ograničenja i radi u Vitest-u kroz `expect.extend(toHaveNoViolations)`.
Namera SPEC §17 ("axe assertions u unit testovima") je očuvana; menja se samo alat.

### 1.6 Rizici koje nosi skok verzija

| # | Rizik | Kada se vidi | Plan |
|---|---|---|---|
| 1 | **React Router 7 → 8** je major; SPEC je pisan za v7 | F5 | Router fajl je jedan (`src/app/router.tsx`), površina mala. Ako API pukne — pin na poslednji v7 i ADR. |
| 2 | **zod 3 → 4**: `z.string().email()` je u v4 zamenjen sa `z.email()` | F5 | Jedini potrošač je `ContactForm.tsx` (8 linija šeme). Trivijalna migracija. |
| 3 | **`rollup-plugin-visualizer` uz rolldown** — Vite 8 nije više rollup | F6 | Ako ne radi, zameniti `rolldown` ugrađenim izveštajem ili `vite-bundle-visualizer`. Ne blokira `size-limit`, koji je pravi CI gate. |
| 4 | **lucide-react 0.511 → 1.31** major | F4 | Per-icon import je stabilan API; očekivano bezbolno. |
| 5 | **`eslint-plugin-react-hooks` 5 → 7** prijaviće lavinu | F3 | Namerno rano — dok koda ima malo. |
| 6 | **i18next 25 → 26 + ICU** | F4 | ICU je nov sloj (srpski plural `one/few/other`), ne migracija postojećeg. |

### 1.7 Kako se verzije reprodukuju

```bash
node scripts/check-versions.mjs     # ispisuje latest sa registry-ja i diff prema pinovima
pnpm outdated -r                    # isto, kroz pnpm, po workspace-u
```

Pinovi žive u `pnpm-workspace.yaml` pod `catalog:` — jedna verzija za ceo monorepo,
paketi je referišu sa `"react": "catalog:"`. Promena verzije = izmena na jednom mestu.

---

## 2. Enforcement — pravilo bez lint rule je želja

**Najveći rizik ovog repoa nije stek nego drift.** Dokumentacija koja se ne proverava mašinski
je dokumentacija koja se ignoriše. Zato svako pravilo iz `docs/` ima svoj mehanizam:

| Pravilo | Doc | Mehanizam |
|---|---|---|
| Granice slojeva | [`01`](01-architecture.md) | `import/no-restricted-paths` |
| Import samo iz barrel-a | [`01`](01-architecture.md) | `import/no-internal-modules` |
| Hook pravila + React Compiler | [`07`](07-performance.md) | `eslint-plugin-react-hooks` v7 |
| Bez literal stringova u UI | [`09`](09-i18n.md) | `eslint-plugin-i18next/no-literal-string` |
| A11y | [`15`](15-accessibility.md) | `eslint-plugin-jsx-a11y` (error) |
| Bez `any`, bez `!` | [`03`](03-naming-conventions.md) | `typescript-eslint` strict-type-checked |
| Max 2 `useState` | [`07`](07-performance.md) §4 | **custom rule** `max-usestate` |
| `// effect:` komentar | [`07`](07-performance.md) §3 | **custom rule** `require-effect-comment` |
| Bundle budžet | [`07`](07-performance.md) §6 | `size-limit` u CI |
| Lighthouse | [`07`](07-performance.md) §7 | `@lhci/cli` assertions |
| Coverage pragovi | [`12`](12-testing.md) | Vitest thresholds |
| i18n rupe | [`09`](09-i18n.md) | `i18next-parser` + diff check |
| Commit format | — | `commitlint` |

### Custom pravila

Žive u `packages/config/eslint-config/rules/`. SPEC ih eksplicitno traži jer standardni
plugini ne pokrivaju ova dva zahteva.

```js
// max-usestate — prijavljuje 3+ useState poziva u jednoj komponenti
'@app/max-usestate': ['error', { max: 2 }]

// require-effect-comment — traži komentar koji počinje sa "effect:" iznad useEffect-a
'@app/require-effect-comment': 'error'
```

Oba imaju sopstvene testove (`RuleTester`) — lint pravilo bez testa je isto što i kod bez testa.

### Zone granica

```js
'import/no-restricted-paths': ['error', { zones: [
  { target: './src/features/*', from: './src/features/*', except: ['./index.ts'] },
  { target: './src/components', from: './src/features' },
  { target: './src/lib',        from: ['./src/features', './src/pages'] },
]}]
```

Da ovo stvarno radi dokazuje se testom u F7: namerno kršenje granice **obara build**.

---

## 3. CI (GitHub Actions)

```
install (pnpm cache)
  → typecheck → lint → test (+coverage) → build
  → size-limit → lighthouse-ci → e2e (playwright)
  → changesets release
```

Turborepo gradi **samo promenjeno**:

```bash
turbo run build --filter=[origin/dev]
```

| Gate | Prag | Gde je definisan |
|---|---|---|
| Coverage `packages/utils` | 100% | `vitest.config.ts` |
| Coverage `features/*/hooks` | ≥ 90% | isto |
| Coverage ukupno | ≥ 80% | isto |
| Initial JS | ≤ 150 KB gzip | `.size-limit.json` |
| CSS | ≤ 20 KB gzip | isto |
| Po ruti | ≤ 60 KB gzip | isto |
| Lighthouse performance | ≥ 0.95 | `lighthouserc.json` |
| Lighthouse a11y / best-practices / SEO | 1.0 | isto |
| axe violations | 0 | Vitest + Playwright |

## 4. Env

`packages/utils/src/env` sa zod šemom — **build pada ako fali obavezna varijabla**.

```ts
export const env = envSchema.parse(import.meta.env);
```

**Nikad `import.meta.env.X` direktno.** `VITE_` prefiks znači da je vrednost **javno vidljiva**
u bundle-u — nikad tajne. Vidi [`20-security.md`](20-security.md).

## 5. Git hooks

| Hook | Radi |
|---|---|
| `pre-commit` | `lint-staged` — ESLint `--fix` + Prettier na staged fajlovima |
| `commit-msg` | `commitlint` — conventional commits |
| `pre-push` | `pnpm typecheck` |

Changesets za verzionisanje paketa: `/changeset` pravi changeset iz git diff-a.

## Checklist

- [ ] Novo pravilo u `docs/` ima svoj red u tabeli §2
- [ ] Novo lint pravilo ima `RuleTester` test
- [ ] Nova verzija paketa je u `catalog:`, ne u pojedinačnom `package.json`
- [ ] Novi CI gate ima prag zapisan ovde
- [ ] `pnpm validate` prolazi lokalno pre push-a
