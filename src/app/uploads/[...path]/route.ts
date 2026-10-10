import { NextResponse } from 'next/server'

import { HTTP_STATUS } from '@/constants/http'
import { handle } from '@/server/http'
import { readUpload } from '@/server/uploads/storage'

/**
 * Otpremljene slike sa diska (volume). Zaglavlja koja se lako zaborave, a svako je posebna
 * greška:
 * - `Content-Security-Policy: default-src 'none'; sandbox` — SVG sa `<script>` ne izvršava ništa
 *   (bez ovoga je otpremljen SVG stored-XSS na poreklu sajta);
 * - `nosniff` + `inline` — pretraživač ne pogađa tip;
 * - `immutable` — ime je UUID, sadržaj pod istim imenom se nikad ne menja.
 */
export const GET = handle<{ path: string[] }>(async (_request, { params }) => {
  const { path } = await params
  const file = path.length === 1 && path[0] ? await readUpload(path[0]) : null
  if (!file) return new NextResponse(null, { status: HTTP_STATUS.NOT_FOUND })

  return new NextResponse(new Uint8Array(file.body), {
    headers: {
      'Content-Type': file.mimeType,
      'Content-Length': String(file.size),
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox",
      'Content-Disposition': 'inline',
      'X-Content-Type-Options': 'nosniff',
      'Cross-Origin-Resource-Policy': 'same-site',
    },
  })
})
