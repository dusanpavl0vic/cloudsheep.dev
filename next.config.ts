import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'
import { withYak } from 'next-yak/withYak'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** Zaglavlja koja važe za sve odgovore. CSP sa nonce-om postavlja `src/proxy.ts`. */
const SECURITY_HEADERS = [
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

/** Admin i API se nikad ne indeksiraju — zaglavlje, ne samo meta, jer API nema HTML. */
const NOINDEX = [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]

const nextConfig: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  productionBrowserSourceMaps: process.env.SOURCE_MAPS === '1',
  reactCompiler: true,
  // CSS u `<style>` u HTML-u: next-yak pravi CSS po modulu, pa bi stranica blokirala render na
  // 12–21 malih CSS zahteva. Ceo CSS je ~10 KB gzip, a stranice su ionako dinamičke (nonce).
  experimental: { inlineCss: true },
  // `/contact/` → 308 → `/contact`. Jedna adresa po stranici (docs/05-routing.md §4).
  trailingSlash: false,
  // Bez optimizacije u runtime-u: sharp troši stotine MB po zahtevu, a server ima 4 GB.
  // Slike se pri otpremanju čuvaju u veličini u kojoj se prikazuju (docs/07-performance.md §6).
  images: { unoptimized: true },
  // pdfkit čita AFM fajlove fontova sa diska relativno na sopstveni paket — bundlovan ih ne nađe.
  serverExternalPackages: ['pdfkit'],
  // Fontovi CV-a se čitaju sa diska u runtime-u, pa ih file tracing sam ne vidi.
  outputFileTracingIncludes: { '/api/admin/team/[id]/cv.pdf': ['./assets/fonts/**'] },
  redirects: () =>
    Promise.resolve([
      // Stranica „Uses" je postala sekcija „Stack" na početnoj.
      { source: '/uses', destination: '/#stack', permanent: true },
      { source: '/sr/uses', destination: '/sr#stack', permanent: true },
    ]),
  headers: () =>
    Promise.resolve([
      { source: '/:path*', headers: SECURITY_HEADERS },
      { source: '/admin/:path*', headers: NOINDEX },
      { source: '/admin', headers: NOINDEX },
      { source: '/api/:path*', headers: NOINDEX },
    ]),
}

/**
 * next-yak (ADR 0015): CSS se izvlači u build-u. Nativni CSS umesto CSS Modules — globalne
 * `@keyframes cs-*` (styles/animations.ts) zadržavaju ime, pa ih šabloni zovu konstantom.
 */
const YAK_CONFIG = { experiments: { transpilationMode: 'Css' as const } }

export default withNextIntl(withYak(YAK_CONFIG, nextConfig))
