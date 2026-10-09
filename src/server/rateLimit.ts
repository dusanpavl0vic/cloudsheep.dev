import 'server-only'

import { HTTP_STATUS } from '@/constants/http'

import { isTest } from './env'
import { HttpError } from './http'

interface Bucket {
  count: number
  resetAt: number
}

const buckets = new Map<string, Bucket>()

/** Granica rasta memorije: brojači koji su istekli brišu se kad mapa pređe ovoliko ključeva. */
const SWEEP_AT = 5_000

const sweep = (now: number) => {
  for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key)
}

interface RateLimitOptions {
  name: string
  limit: number
  windowMs: number
  /** U testovima je isključen (brojač bi se prenosio iz testa u test); test samog limitera ga uključuje. */
  enabled?: () => boolean
}

/**
 * Fiksni prozor po ključu (obično IP), u memoriji procesa.
 *
 * Dovoljno za JEDAN kontejner — što je naša postavka (ADR 0009). Sa više instanci brojač bi
 * morao u Redis. Restart ga briše; to je prihvatljivo, cilj je da uspori bota, ne da broji tačno.
 */
export const rateLimit = ({
  name,
  limit,
  windowMs,
  enabled = () => !isTest(),
}: RateLimitOptions) => {
  return (key: string) => {
    if (!enabled()) return

    const now = Date.now()
    if (buckets.size > SWEEP_AT) sweep(now)

    const id = `${name}:${key}`
    const bucket = buckets.get(id)

    if (!bucket || bucket.resetAt <= now) {
      buckets.set(id, { count: 1, resetAt: now + windowMs })
      return
    }
    if (bucket.count >= limit)
      throw new HttpError(HTTP_STATUS.TOO_MANY_REQUESTS, 'errors.tooManyRequests')
    bucket.count += 1
  }
}

export const LIMITS = {
  /** Potvrda linkom: dugme sa stranice; token je 32 bajta — ograničenje je protiv šuma, ne pogađanja. */
  confirm: rateLimit({ name: 'confirm', limit: 30, windowMs: 10 * 60 * 1000 }),
  /** Prijava: 10 / 15 min po IP-u. */
  login: rateLimit({ name: 'login', limit: 10, windowMs: 15 * 60 * 1000 }),
  /** Kontakt forma: 5 / sat — javna je i nema lozinku koja bi zaustavila bota. */
  contact: rateLimit({ name: 'contact', limit: 5, windowMs: 60 * 60 * 1000 }),
  /** Provera adrese dok se kuca: šira, ali ne beskonačna (svaka je DNS upit). */
  emailCheck: rateLimit({ name: 'email-check', limit: 60, windowMs: 10 * 60 * 1000 }),
  newsletter: rateLimit({ name: 'newsletter', limit: 5, windowMs: 60 * 60 * 1000 }),
  uploads: rateLimit({ name: 'uploads', limit: 60, windowMs: 15 * 60 * 1000 }),
}
