import 'server-only'

import type { NextRequest } from 'next/server'

/**
 * IP posetioca iza Traefika. Traefik dodaje pravu adresu na KRAJ `X-Forwarded-For`; prvi
 * element može da podmetne sam klijent, pa se uzima poslednji koji je dodao naš proxy.
 * Bez proxy-ja (lokalno) zaglavlja nema — svi dele ključ `local`.
 */
export const clientIp = (request: NextRequest) => {
  const forwarded = request.headers.get('x-forwarded-for')
  const last = forwarded?.split(',').at(-1)?.trim()
  if (last) return last
  return request.headers.get('x-real-ip') ?? 'local'
}

export const userAgent = (request: NextRequest) =>
  request.headers.get('user-agent')?.slice(0, 300) ?? null
