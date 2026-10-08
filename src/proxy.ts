import { NextRequest, NextResponse } from 'next/server'
import createMiddleware from 'next-intl/middleware'

import { SITE_URL } from '@/constants/env'
import { ROUTES } from '@/constants/routes'
import { routing } from '@/i18n/routing'

const handleI18nRouting = createMiddleware(routing)

const IS_DEV = process.env.NODE_ENV === 'development'

/**
 * CSP sa nonce-om po zahtevu (docs/20-security.md §2).
 *
 * - `script-src`: samo skripte sa nonce-om; `strict-dynamic` veruje onima koje one učitaju
 *   (Next chunk-ovi). `'unsafe-eval'` samo u razvoju — React ga koristi za stack trace.
 * - `style-src`: `'unsafe-inline'` OSTAJE — styled-components ubacuje `<style>` u runtime-u,
 *   a `style={{}}` atribute nonce ne pokriva. Nonce u `style-src` bi poništio `'unsafe-inline'`.
 */
const buildCsp = (nonce: string) =>
  [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'${IS_DEV ? " 'unsafe-eval'" : ''}`,
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self'",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "object-src 'none'",
    ...(IS_DEV ? [] : ['upgrade-insecure-requests']),
  ].join('; ')

/**
 * Poddomeni iz vremena tri kontejnera (ADR 0009):
 * - `admin.cloudsheep.dev/*` → `cloudsheep.dev/admin/*`
 * - `api.cloudsheep.dev` služi samo stare `/uploads/*` adrese iz baze (matcher ih ne hvata);
 *   sve ostalo ide na sajt, da Google prestane da indeksira prazan API.
 */
const redirectLegacyHost = (request: NextRequest) => {
  const host = request.headers.get('host') ?? ''
  const { pathname, search } = request.nextUrl

  if (host.startsWith('admin.')) {
    const path = pathname === ROUTES.HOME ? ROUTES.ADMIN : `${ROUTES.ADMIN}${pathname}`
    return NextResponse.redirect(`${SITE_URL}${path}${search}`, 301)
  }
  if (host.startsWith('api.')) return NextResponse.redirect(SITE_URL, 301)

  return null
}

export const proxy = (request: NextRequest) => {
  const legacy = redirectLegacyHost(request)
  if (legacy) return legacy

  const nonce = Buffer.from(crypto.randomUUID()).toString('base64')
  const csp = buildCsp(nonce)

  // Next čita nonce iz CSP zaglavlja ZAHTEVA i dodaje ga svojim skriptama.
  const headers = new Headers(request.headers)
  headers.set('x-nonce', nonce)
  headers.set('content-security-policy', csp)

  const isAdmin =
    request.nextUrl.pathname === ROUTES.ADMIN ||
    request.nextUrl.pathname.startsWith(`${ROUTES.ADMIN}/`)

  // Admin nema jezički prefiks (ADR 0012); sve ostalo prolazi kroz next-intl.
  const response = isAdmin
    ? NextResponse.next({ request: { headers } })
    : handleI18nRouting(new NextRequest(request, { headers }))

  response.headers.set('Content-Security-Policy', csp)
  return response
}

export const config = {
  // Sve osim API-ja, otpremljenih slika, Next internih putanja i fajlova sa ekstenzijom
  // (fontovi, favicon, robots.txt, sitemap.xml) — njima ne treba ni jezik ni nonce.
  // Prefetch zahtevi NE smeju da se preskoče kao u Next primeru za CSP: next-intl ih
  // prepisuje (`/projects` → `/en/projects`), bez toga bi prefetch vratio 404.
  matcher: ['/((?!api|uploads|_next|.*\\..*).*)'],
}
