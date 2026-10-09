---
description: Pravi overlay modal — ime u MODALS/MODAL_KIND, lazy red u OVERLAY_MODALS, logika u domenskom hooku, i18n
argument-hint: [Name] [domain]
arguments: Name domain
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm lint:*), Bash(pnpm typecheck:*), Bash(pnpm exec eslint:*)
---

Napravi modal `$Name` za domen `$domain`.

## Prvo pročitaj

`docs/06-modals.md` — ceo. Potvrda je `useConfirm` (ne pravi novi modal za „Obrisati?").

## Koraci

1. `constants/modals.ts`: ime u `MODALS` i vrsta u `MODAL_KIND` (`overlay`).
2. `src/modals/$Name/$Name.tsx` (+ `index.ts`): prima `{ props, onClose }` (`OverlayModalProps`),
   koristi `Overlay` ili `FormDialog` (admin forma). Bez store-a i RTKQ-a u modalu.
3. Logika u `src/hooks/<…>/$domain/use<Nešto>.ts` (npr. `use<Domen>Form(id, onSaved)`): zapis
   čita iz RTKQ keša po `id`, čuva kroz mutaciju, zatvara na uspeh.
4. `modals/ModalRoot/ModalRoot.constants.ts`: `lazy(() => import('../$Name'))`.
5. Otvaranje iz domenskog hooka: `useModal(MODALS.X).open({ id })` — props samo serijalizabilni.

## Acceptance

- Esc, klik na pozadinu i dugme zatvaraju; fokus ostaje u dijalogu
- Tekst kroz `t()` u `en.ts` i `sr.ts`
- Nema `useState(false)` za otvaranje
