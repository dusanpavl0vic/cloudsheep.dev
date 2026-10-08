import 'server-only'

import jwt from 'jsonwebtoken'
import { createHash, randomBytes } from 'node:crypto'

import { env } from '../env'

export interface AccessTokenPayload {
  sub: string
  email: string
  role: string
}

/** `exactOptionalPropertyTypes`: tip `expiresIn` uključuje `undefined`, a zod ima podrazumevanu. */
type ExpiresIn = NonNullable<jwt.SignOptions['expiresIn']>

export const signAccessToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, env().JWT_SECRET, { expiresIn: env().ACCESS_TOKEN_TTL as ExpiresIn })

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env().JWT_SECRET) as AccessTokenPayload

/**
 * U bazi stoji heš, ne sam token — ko pročita bazu ne dobija upotrebljive sesije. SHA-256 je
 * ovde dovoljan (za razliku od lozinki): ulaz je 48 slučajnih bajtova, pa rečnik nema smisla.
 */
export const hashRefreshToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex')

/**
 * Refresh token je slučajan niz, ne JWT: jedina mu je uloga da pokaže na red u bazi. Potpisan
 * JWT bi ostao važeći do isteka i posle odjave.
 */
export const createRefreshToken = () => {
  const token = randomBytes(48).toString('base64url')
  return { token, tokenHash: hashRefreshToken(token) }
}

export const refreshExpiry = (remembered: boolean): Date => {
  const days = remembered ? env().REFRESH_TTL_DAYS_REMEMBERED : env().REFRESH_TTL_DAYS
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}
