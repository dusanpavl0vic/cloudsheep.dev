import jwt from 'jsonwebtoken'
import { createHash, randomBytes } from 'node:crypto'

import { env } from '../env.ts'

export interface AccessTokenPayload {
  sub: string
  email: string
  role: string
}

/**
 * Cast na `NonNullable` je nužan zbog `exactOptionalPropertyTypes`: `SignOptions['expiresIn']`
 * po tipu uključuje `undefined`, a naša zod šema ima `.default('15m')` pa vrednosti nikad nema.
 * Bez toga TS odbija objekat čije polje MOŽE biti `undefined`, iako u praksi nije.
 */
type ExpiresIn = NonNullable<jwt.SignOptions['expiresIn']>

export const signAccessToken = (payload: AccessTokenPayload): string =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.ACCESS_TOKEN_TTL as ExpiresIn })

export const verifyAccessToken = (token: string): AccessTokenPayload =>
  jwt.verify(token, env.JWT_SECRET) as AccessTokenPayload

/**
 * Refresh token je slučajan niz, ne JWT.
 *
 * Nema šta da nosi — jedina mu je uloga da pokaže na red u bazi. Slučajan niz se ne može
 * ni pročitati ni falsifikovati bez tog reda, dok potpisan JWT ostaje važeći do isteka
 * čak i posle odjave.
 */
export const createRefreshToken = () => {
  const token = randomBytes(48).toString('base64url')
  return { token, tokenHash: hashRefreshToken(token) }
}

/**
 * U bazi stoji heš, ne sam token — isti razlog kao za lozinke: ko pročita bazu ne dobija
 * upotrebljive sesije. SHA-256 je ovde dovoljan (za razliku od lozinki): ulaz je 48
 * slučajnih bajtova, pa napad rečnikom nema smisla.
 */
export const hashRefreshToken = (token: string): string =>
  createHash('sha256').update(token).digest('hex')

export const refreshExpiry = (remembered: boolean): Date => {
  const days = remembered ? env.REFRESH_TTL_DAYS_REMEMBERED : env.REFRESH_TTL_DAYS
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000)
}
