import 'server-only'

import { revalidateTag, unstable_cache } from 'next/cache'

import { CACHE_REVALIDATE_S, type CacheTag } from '@/constants/cache'

/**
 * Keš podataka javnih stranica (docs/11-data-fetching.md §2).
 *
 * Stranice su dinamičke (CSP nonce po zahtevu), pa bez ovoga svaki posetilac znači upit u
 * bazu. Rezultat se čuva kao JSON — funkcija mora da vrati serijalizabilne podatke (datum kao
 * ISO string), što serializeri u `services/` i rade.
 */
export const cached = <A extends unknown[], R>(
  fn: (...args: A) => Promise<R>,
  key: string,
  tags: CacheTag[],
) => unstable_cache(fn, [key], { tags, revalidate: CACHE_REVALIDATE_S })

/**
 * Posle izmene u admin-u: sledeći zahtev ne sme da dobije staro (`expire: 0`). Javna stranica
 * tako vidi novo stanje odmah, bez rebuild-a.
 */
export const invalidate = (...tags: CacheTag[]) => {
  for (const tag of tags) revalidateTag(tag, { expire: 0 })
}
