import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const BASE_URL = `http://localhost:${String(PORT)}`

/**
 * E2E se vozi nad **produkcijskim buildom**, ne nad dev serverom.
 *
 * Dev server servira nemitifikovane ESM module sa react-refresh-om, pa se tamo meri i testira
 * nešto što nijedan posetilac neće videti (`apps/web/CLAUDE.md`). `turbo.json` zato ima
 * `e2e.dependsOn: ["build"]` — `dist` postoji pre nego što se ovo pokrene.
 *
 * **Šta ovde ima smisla testirati, a šta ne.** Sve što jsdom može, ostaje u Vitest-u — brže
 * je i preciznije. Ovde idu samo stvari koje traže pravi pretraživač:
 *   • native `<dialog>` sa `showModal()` — jsdom nema top-layer, pa sam u unit testu morao
 *     da stubujem `showModal` i `close`. Zamka fokusa i `Esc` se mogu proveriti samo ovde.
 *   • prava navigacija i lazy chunk-ovi
 *   • pristupačnost nad stvarno renderovanom stranicom (axe)
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  // Slučajan `test.only` ne sme da prođe kroz CI i tiho isključi ostatak paketa
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [['html', { open: 'never' }], ['list']] : 'list',

  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    // Mobilni panel je poseban raspored, ne samo uža ista stranica — mora se voziti zasebno
    { name: 'mobile', use: { ...devices['Pixel 7'] } },
  ],

  webServer: {
    command: 'pnpm preview',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
})
