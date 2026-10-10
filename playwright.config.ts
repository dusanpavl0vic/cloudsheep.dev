import { defineConfig, devices } from '@playwright/test'

/**
 * E2E nad PRODUKCIONIM build-om (docs/12 §5): `pnpm build && pnpm e2e`. Baza je ista kao za
 * aplikaciju (u CI-u Postgres servis + seed). Lokalno se može ciljati već pokrenut server:
 * `E2E_BASE_URL=http://localhost:3200 pnpm e2e`.
 */
const PORT = 3400
const external = process.env.E2E_BASE_URL

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL: external ?? `http://localhost:${String(PORT)}`,
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  ...(external
    ? {}
    : {
        webServer: {
          command: `node node_modules/next/dist/bin/next start -p ${String(PORT)}`,
          url: `http://localhost:${String(PORT)}/api/health`,
          reuseExistingServer: false,
          timeout: 60_000,
          env: { NODE_ENV: 'production' },
        },
      }),
})
