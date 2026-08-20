import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    /*
     * Podrazumevanih 5 s je premalo kad `turbo` pusti sve jsdom pakete PARALELNO: otimaju se
     * o ista jezgra, pojedinačni `waitFor` probije rok i paket padne nasumično — lokalno
     * dvaput od tri pokretanja, dok isti paket pušten sam prolazi za 8 s.
     *
     * Granica postoji da uhvati ZAGLAVLJEN test, ne da meri koliko je mašina zauzeta.
     */
    // Turbo je već na `--concurrency=3`, ali svaki vitest povrh toga cepa jedan fork po
    // jezgru — 3 × 7 = 21 proces na 8 jezgara. Otud `Failed to start forks worker`.
    maxWorkers: 2,
    testTimeout: 20_000,
    hookTimeout: 20_000,
    setupFiles: ['./vitest.setup.ts'],
    /**
     * Env za testove stoji OVDE, ne u `.env` fajlu.
     *
     * `src/lib/env.ts` validira `import.meta.env` i baca **pri importu modula**, pa svaki
     * test koji dodirne `@/store` pada pre nego što se ijedan `it` pokrene. Lokalno to nije
     * primetno jer `apps/admin/.env` postoji — ali je gitignore-ovan, pa u CI-ju nema ničega
     * i tri test fajla su padala kao „0 test".
     *
     * Vrednosti su namerno lažne: testovi presreću mrežu MSW-om, pa `VITE_API_URL` treba
     * samo da bude ispravan URL koji se poklapa sa onim u handler-ima. Ovako je test paket
     * determinističan i ne zavisi od toga šta ko ima na disku.
     */
    env: {
      VITE_APP_ENV: 'test',
      // Bez `/api` sufiksa — API servira `/auth/login` i `/admin/projects` na korenu.
      // Ranije je ovde stajalo `.../api`, pa su handleri u testovima opisivali putanje
      // koje na serveru ne postoje; MSW to ne primeti, jer presreće šta god da se pošalje.
      VITE_API_URL: 'http://localhost:3000',
    },
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/index.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.variants.ts',
        'src/main.tsx',
        /*
         * Čisto ožičenje — konstante i sastavljanje provajdera, bez ijedne grane.
         *
         * Ovo NIJE način da prag prođe: mera je namerno postavljena na logiku, jer test
         * koji poredi `ROUTES.LOGIN` sa `'/login'` samo ponavlja isti string i pada tek
         * kad se oba menjaju zajedno — dakle nikad. Sve što ima granu (`RequireAuth`,
         * `useLogout`, `auth.slice`, forme) ostaje mereno.
         *
         * Ako neki od ovih fajlova dobije logiku, briše se odavde.
         */
        'src/App.tsx',
        'src/i18n.ts',
        'src/lib/routes.ts',
        'src/lib/storageKeys.ts',
        'src/providers/AppProviders.tsx',
        'src/routes/router.tsx',
      ],
      thresholds: { lines: 80, functions: 80, branches: 75, statements: 80 },
    },
  },
})
