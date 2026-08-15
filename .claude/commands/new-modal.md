---
description: Pravi modal, upisuje ga u modalRegistry i ModalPropsMap, dodaje i18n ključeve i test open/close/confirm
argument-hint: [app] [feature] [Name]
arguments: app feature Name
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm lint:*), Bash(pnpm test:*)
---

Napravi modal `$Name` u `apps/$app/src/features/$feature/modals/`.

## Prvo pročitaj

- `docs/06-modals.md` — ceo modal sistem
- `docs/adr/0006-modal-engine.md` — koji engine je u upotrebi

## Koraci

1. `modals/$Name.tsx` — **`default export`** (potreban za `lazy()`), prima `onClose`
2. Upiši u `apps/$app/src/providers/modalRegistry.ts`. ID modala je `<feature>.<Name>`
   u kebab-case — npr. feature `projects` + `ConfirmDelete` → `'projects.confirm-delete'`:
   ```ts
   'projects.confirm-delete': lazy(() => import('@/features/projects/modals/ConfirmDelete')),
   ```
3. Upiši tip propsa u `ModalPropsMap` kroz `declare module '@app/core'` — **oba koraka, uvek**.
   TypeScript mora da odbije registraciju modala bez tipa propsa.
4. i18n ključevi `<feature>.modals.<name>.*` u `sr.json` **i** `en.json`
5. Test: open → prikazan · confirm → promise resolve `true` · ESC → `undefined`

## Pravila

- Modal **vraća rezultat** kroz `onClose`, ne dispatch-uje domensku akciju sam
- Radix `Dialog` je mehanika — ne pisati ručno focus trap, ESC ni scroll lock
- Destruktivna akcija dobija `meta.dismissible: false`
- Nema `useState(false)` nigde — otvaranje ide kroz `useModal().open()`
- Pozivalac koristi `const result = await open('<id-modala>', props)`, nikad `useEffect`
  koji sluša rezultat

## Acceptance

- `pnpm lint && pnpm test --filter=$app` prolazi
- Modal je lazy — ne pojavljuje se u initial chunk-u (proveri `/bundle-check` ako sumnjaš)
- `ModalPropsMap` unos postoji; brisanje tipa obara typecheck
