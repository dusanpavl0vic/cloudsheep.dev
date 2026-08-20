import { z } from 'zod'

import { createEnv } from '@app/utils/env'

/**
 * `VITE_` prefiks znači da je vrednost JAVNO vidljiva u bundle-u — nikad tajne (docs/20).
 *
 * Do sada `web` nije čitao nijednu env varijablu jer nije imao nijedan endpoint. Sa
 * prelaskom projekata na API, `VITE_API_URL` postaje obavezan: `undefined` bi značio da
 * sajt šalje zahteve na `undefined/projects` i tiho prikazuje prazno.
 *
 * Vrednost je BUILD-TIME — u produkciji ide u Coolify „Build Variables" (`/DEPLOYMENT.md` §3).
 */
export const env = createEnv(
  z.object({
    VITE_APP_ENV: z.enum(['development', 'test', 'production']),
    VITE_API_URL: z.url(),
  }),
  import.meta.env,
)
