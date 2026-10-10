---
description: Pravi komponentu (folder po komponenti, next-yak stilovi, tipovi, barrel) u design sistemu ili domenu
argument-hint: [category] [Name]
arguments: category Name
disable-model-invocation: true
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(pnpm lint:*), Bash(pnpm typecheck:*), Bash(pnpm exec eslint:*)
---

Napravi komponentu `$Name` u `src/components/$category/`.

## Prvo pročitaj

- `docs/02-folder-structure.md` — kategorije i šta gde ide
- `docs/08-styling-ui.md` — next-yak, `.styles.ts` / `.yak.ts`, tokeni, statični `css` blokovi
- `docs/15-accessibility.md` — šta je obavezno

## Provera pre pisanja

- **Design system ili domen?** Kategorije `foundations, buttons, inputs, data-display,
  feedback, navigation, overlays, media, sections, cards, layout, seo` ne znaju za domen ni
  store: tekst i podaci stižu kroz props. Domenske kategorije su `home`, `projects`, `notes`,
  `contact`, `admin/<domen>`. Ako komponenta treba podatke, oni stižu iz domenskog hooka.
- Postoji li već slična komponenta? (`ls src/components/*`)

## Struktura

```
src/components/$category/$Name/
├── $Name.tsx            struktura; logika samo kroz hook (komponenta je „glupa")
├── $Name.styles.ts      next-yak styled komponente — izvozi SAMO styled komponente
├── $Name.types.ts       props (ako ih ima više od par)
├── $Name.yak.ts         opciono: statične vrednosti za interpolaciju (relativni `.ts` importi)
└── index.ts             export { default } from './$Name'
```

## Pravila

- `default export` komponente, arrow funkcija, `'use client'` samo kad treba (hook/handler)
- Bez `'use client'` u `.styles.ts`; varijante kao eksplicitni `css` blokovi po uslovu, nikad
  lookup u objekat css blokova ni čitanje tokena u runtime-u (`@app/no-runtime-tokens`)
- Dinamička vrednost u CSS-u nosi jedinicu: `` `${String(v)}px` ``
- Tekst isključivo kroz `t()` (ključ u `en.ts` **i** `sr.ts`), nikad literal u JSX-u
- Najviše 2 `useState`; `useEffect` samo uz `// effect:` komentar; bez `useMemo/useCallback`
  (React Compiler) osim slučajeva iz `docs/07` §2
- Fajl ≤ 200 linija, komponenta ≤ 150
- `className` prop ako se komponenta stilizuje spolja

## Acceptance

- `pnpm exec eslint src/components/$category/$Name` i `pnpm typecheck` prolaze
- Radi u svetloj i tamnoj temi (tokeni iz `styles/tokens.yak.ts`), fokus vidljiv (`focusRing`)
- Na javnoj stranici: `pnpm size` i dalje ispod 200 KB po ruti
