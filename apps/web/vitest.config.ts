import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    /**
     * Vitest gleda samo `src/`, i to samo `.test.` fajlove.
     *
     * Podrazumevani obrazac hvata i `*.spec.ts`, pa je pokupio Playwright testove iz `e2e/`
     * i pao na `import { test } from '@playwright/test'`. Dva pokretača, dva foldera, dva
     * nastavka — granica mora biti izričita, ne podrazumevana.
     */
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/**/index.ts', 'src/**/*.test.tsx', 'src/**/*.variants.ts', 'src/main.tsx'],
    },
  },
})
