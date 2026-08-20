import type { z } from 'zod'

import { env } from './env'

/**
 * Tanak tipizovan `fetch` za javne, read-only podatke.
 *
 * **Zašto ne RTK Query** (ADR 0009): budžet za početni JS ima manje od 2 KB rezerve, a RTKQ
 * je ~25 KB. Sakriti ga u lazy chunk ne pomaže — `packages/config/vite-config` mapira ceo
 * `@reduxjs/toolkit` u `redux-vendor`, koji je u početnom učitavanju. A ništa zbog čega RTKQ
 * postoji ovde ne postoji: nema sesije, nema mutacija, nema invalidacije keša.
 *
 * Poziva se ISKLJUČIVO iz route loader-a. `useEffect` + `fetch` ostaje zabranjen
 * (docs/07 §3) — loader traži podatke PRE rendera, što je i bila poenta tog pravila.
 */
class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly messageKey: string,
  ) {
    super(messageKey)
    this.name = 'ApiError'
  }
}

export { ApiError }

/**
 * Odgovor se validira zodom, ne veruje mu se na reč (docs/10 §7).
 *
 * Bez toga izmena oblika na serveru prolazi tiho do JSX-a i pada kao „cannot read property
 * of undefined" u komponenti, daleko od uzroka.
 */
export async function apiGet<T>(path: string, schema: z.ZodType<T>): Promise<T> {
  let response: Response

  try {
    response = await fetch(`${env.VITE_API_URL}${path}`, {
      headers: { Accept: 'application/json' },
    })
  } catch {
    // Mreža nije odgovorila — nema statusa, pa 0 znači „nije ni stiglo do servera"
    throw new ApiError(0, 'errors.network')
  }

  if (!response.ok) {
    throw new ApiError(
      response.status,
      response.status === 404 ? 'errors.notFound' : 'errors.unexpected',
    )
  }

  const parsed = schema.safeParse(await response.json())

  if (!parsed.success) {
    throw new ApiError(500, 'errors.unexpected')
  }

  return parsed.data
}
