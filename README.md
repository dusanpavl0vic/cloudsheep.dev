# cloudsheep.dev

Frontend biznis aplikacija — React 19 + TypeScript + Vite + Redux Toolkit (RTK Query) + Tailwind CSS v4 (shadcn/ui pristup) + i18next (SR/EN).

## Pokretanje

```bash
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
```

## Ostale komande

```bash
npm run build      # typecheck + produkcioni build
npm run preview    # pregled produkcionog builda
npm run lint       # ESLint
npm run format     # Prettier
```

## Dokumentacija

Sva pravila arhitekture, strukture i konvencija su u **[PROJECT_GUIDE.md](./PROJECT_GUIDE.md)** — obavezno pročitati pre rada na projektu.

Grane, okruženja i Vercel podešavanja su u **[DEPLOYMENT.md](./DEPLOYMENT.md)**.

## Grane

| Grana  | Okruženje   | Deploy            |
| ------ | ----------- | ----------------- |
| `dev`  | development | — (default grana) |
| `main` | test        | test instanca     |
| `prod` | production  | produkcija        |

Tok: `feature/* → dev → main → prod`. Detalji u [DEPLOYMENT.md](./DEPLOYMENT.md).
