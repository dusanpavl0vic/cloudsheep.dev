# CloudSheep

Frontend biznis aplikacija: React 19 + TypeScript + Vite.

**Pre bilo kakvog rada pročitaj `PROJECT_GUIDE.md`** — tamo su sva pravila arhitekture.

Najvažnija pravila (detalji u vodiču):
- Što manje `useEffect`-a — prvo RTK Query hookovi, event handleri, render/`useMemo`, listener middleware (sekcija 2.1)
- Komponenta = folder: `.tsx` + `.variants.ts` (cva) + `.constants.ts` + `index.ts` (sekcija 2.2)
- Stilovi: Tailwind v4 + shadcn/ui pristup — samo semantičke klase (`bg-primary`), tokeni u `src/styles/global.css` (svetla/tamna tema)
- Svaki UI tekst kroz i18n — dodaje se u `src/i18n/locales/sr.json` I `en.json`
- Konstante odvojene: globalne u `src/constants/`, komponentske u `*.constants.ts`
- Importi preko `@/` alias-a
