import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
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
