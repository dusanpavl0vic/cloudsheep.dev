---
description: Pravi hook na pravom nivou (generički / domenski / admin), sa testom logike i unosom u katalog docs/13
argument-hint: [scope] [useName]
arguments: scope useName
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm lint:*), Bash(pnpm test:*), Bash(pnpm exec eslint:*), Bash(pnpm exec vitest:*)
---

Napravi `$useName` u opsegu `$scope`.

## Prvo pročitaj

`docs/13-hooks.md` (nivoi, oblik povratne vrednosti, katalog) i `docs/07-performance.md` §2–3.

## Gde

| scope | Putanja |
| --- | --- |
| generički (ne zna za domen) | `src/hooks/$useName.ts` |
| javni domen | `src/hooks/<domen>/$useName.ts` (+ `index.ts`) |
| admin | `src/hooks/admin/<domen>/$useName.ts` (+ `index.ts`) |

## Pravila

- `'use client'`, `export const $useName = (...) => { … return { … } }` — objekat, ne niz, ne JSX
- Jedini sloj koji sme `useAppSelector` / `useAppDispatch` / RTKQ hook
- Admin akcije kroz `useAdminAction` (toast), forme kroz `useAdminForm`, potvrde kroz `useConfirm`
- RHF: `useFormState` / `useWatch`, nikad `form.formState` / `form.watch` (React Compiler)
- `useEffect` samo za spoljni sistem, sa `// effect:` komentarom; bez `useMemo/useCallback`
- Netrivijalna logika ide u čistu funkciju u `src/helpers/` sa testom; hook je tanak

## Acceptance

- `pnpm exec eslint` i `pnpm typecheck` prolaze
- Test pored helpera (ili `renderHook` uz `// @vitest-environment jsdom`)
- Upisan u katalog u `docs/13-hooks.md` ako je deljiv
