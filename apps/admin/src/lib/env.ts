import { z } from 'zod'

import { createEnv } from '@app/utils/env'

/**
 * `VITE_` prefiks znači da je vrednost JAVNO vidljiva u bundle-u — nikad tajne (docs/20).
 * Build pada ako fali obavezna varijabla.
 */
export const env = createEnv(
  z.object({
    VITE_APP_ENV: z.enum(['development', 'test', 'production']),
    VITE_API_URL: z.url(),
  }),
  import.meta.env,
)
