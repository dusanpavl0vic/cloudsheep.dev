import { z } from 'zod'

import { createEnv } from '@app/utils/env'

/**
 * `VITE_` prefiks znači da je vrednost JAVNO vidljiva u bundle-u — nikad tajne (docs/20).
 *
 * **Provera je pri UČITAVANJU modula, ne pri build-u.** Ranije je ovde pisalo da build pada;
 * ne pada — Vite prosto ugradi `undefined` i bundle se napravi. Aplikacija onda pukne na
 * prvom otvaranju, sa ovom porukom. Zato ove vrednosti idu u Coolify **Build Variables**
 * (docker build args), ne u obične env varijable — runtime env kontejner ne vidi jer je
 * bundle već napravljen (`/DEPLOYMENT.md`).
 *
 * Testovi ne zavise od `.env` fajla — vrednosti im daje `test.env` u `vitest.config.ts`.
 */
export const env = createEnv(
  z.object({
    VITE_APP_ENV: z.enum(['development', 'test', 'production']),
    VITE_API_URL: z.url(),
  }),
  import.meta.env,
)
