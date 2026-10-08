import 'server-only'

import type { NextResponse } from 'next/server'

import { REFRESH_COOKIE, REFRESH_COOKIE_PATH } from '@/constants/cookies'

import { isProduction } from '../env'

/**
 * Refresh token: httpOnly (JS ga nikad ne vidi), samo na `/api/auth` (ne putuje uz svaki
 * zahtev), `SameSite=Lax`, `Secure` u produkciji (docs/20-security.md §3).
 */
export const setRefreshCookie = (response: NextResponse, token: string, expires: Date) => {
  response.cookies.set(REFRESH_COOKIE, token, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: 'lax',
    path: REFRESH_COOKIE_PATH,
    expires,
  })
}

/**
 * Briše kolačić i na `/` — stari Express API ga je postavljao na koren, pa sesija ulogovana
 * pre prelaska (ADR 0009) inače ostaje u pregledaču i posle odjave.
 */
export const clearRefreshCookie = (response: NextResponse) => {
  for (const path of [REFRESH_COOKIE_PATH, '/']) {
    response.cookies.set(REFRESH_COOKIE, '', { httpOnly: true, path, expires: new Date(0) })
  }
}
