import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    /*
     * Podrazumevanih 5 s je premalo kad `turbo` pusti sve pakete PARALELNO.
     *
     * `RuleTester` iz ESLint-a za svaki slučaj podigne ceo linter, pa `max-usestate.test.js`
     * pod opterećenjem traje preko 5 s i padne — a pušten sam prođe za sekundu. Isto važi
     * i za jsdom pakete, gde ista granica stoji u njihovim `vitest.config.ts`.
     *
     * Granica postoji da uhvati ZAGLAVLJEN test, ne da meri koliko je mašina zauzeta.
     */
    testTimeout: 20_000,
    hookTimeout: 20_000,
  },
})
