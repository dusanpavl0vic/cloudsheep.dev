import jwt from 'jsonwebtoken'
import { describe, expect, it } from 'vitest'

import {
  createRefreshToken,
  hashRefreshToken,
  refreshExpiry,
  signAccessToken,
  verifyAccessToken,
} from './tokens.ts'

const payload = { sub: 'u1', email: 'a@b.rs', role: 'admin' }

describe('access token', () => {
  it('potpisuje i vraća isti sadržaj', () => {
    const decoded = verifyAccessToken(signAccessToken(payload))

    expect(decoded).toMatchObject(payload)
  })

  it('odbija izmenjen token', () => {
    const token = signAccessToken(payload)
    // Menja se poslednji znak potpisa — sadržaj ostaje isti, potpis više ne odgovara
    const tampered = token.slice(0, -1) + (token.endsWith('a') ? 'b' : 'a')

    expect(() => verifyAccessToken(tampered)).toThrow()
  })

  it('odbija token potpisan drugim ključem', () => {
    const foreign = jwt.sign(payload, 'neki-sasvim-drugi-kljuc-od-trideset-dva-znaka')

    expect(() => verifyAccessToken(foreign)).toThrow()
  })

  it('nosi rok trajanja', () => {
    const decoded = jwt.decode(signAccessToken(payload)) as { exp?: number }

    expect(decoded.exp).toBeTypeOf('number')
  })
})

describe('refresh token', () => {
  /* Sirov token ide korisniku, u bazi stoji samo heš — ko pročita bazu ne dobija sesije. */
  it('vraća sirov token i njegov heš, koji nisu isti', () => {
    const { token, tokenHash } = createRefreshToken()

    expect(token).not.toBe(tokenHash)
    expect(tokenHash).toBe(hashRefreshToken(token))
  })

  it('dva poziva daju različite tokene', () => {
    expect(createRefreshToken().token).not.toBe(createRefreshToken().token)
  })

  it('heš je determinističan', () => {
    expect(hashRefreshToken('isti-ulaz')).toBe(hashRefreshToken('isti-ulaz'))
  })

  it('token je dovoljno dugačak da pogađanje nema smisla', () => {
    // 48 slučajnih bajtova u base64url
    expect(createRefreshToken().token.length).toBeGreaterThanOrEqual(60)
  })
})

describe('refreshExpiry', () => {
  it('„zapamti me" traje duže od obične sesije', () => {
    expect(refreshExpiry(true).getTime()).toBeGreaterThan(refreshExpiry(false).getTime())
  })

  it('rok je u budućnosti', () => {
    expect(refreshExpiry(false).getTime()).toBeGreaterThan(Date.now())
  })
})
