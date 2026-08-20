import { Prisma } from '@prisma/client'
import { describe, expect, it } from 'vitest'

import { toHttpError, withPrismaErrors } from './prismaError.ts'
import { HttpError } from '../middleware/error.ts'

const prismaError = (code: string, meta?: Record<string, unknown>) =>
  new Prisma.PrismaClientKnownRequestError('poruka iz Prisme', {
    code,
    clientVersion: 'test',
    ...(meta ? { meta } : {}),
  })

describe('toHttpError', () => {
  it('P2002 → 409 sa poljem koje je u sukobu', () => {
    const result = toHttpError(prismaError('P2002', { target: ['slug'] }))

    expect(result).toBeInstanceOf(HttpError)
    expect(result).toMatchObject({
      status: 409,
      messageKey: 'errors.conflict',
      details: { field: 'slug' },
    })
  })

  it('P2002 bez `meta.target` → 409 bez polja', () => {
    const result = toHttpError(prismaError('P2002')) as HttpError

    expect(result.status).toBe(409)
    expect(result.details).toBeUndefined()
  })

  it('P2025 → 404', () => {
    expect(toHttpError(prismaError('P2025'))).toMatchObject({
      status: 404,
      messageKey: 'errors.notFound',
    })
  })

  it('P2003 → 400', () => {
    expect(toHttpError(prismaError('P2003'))).toMatchObject({ status: 400 })
  })

  /*
   * Neprevedene greške se PROPUŠTAJU nepromenjene, namerno.
   *
   * Pretvoriti ih u 4xx značilo bi reći klijentu da je on kriv za pad baze, i sakriti
   * pravi uzrok iz loga. One jesu 500 i treba da se vide.
   */
  it('nepoznat Prisma kod prolazi nepromenjen', () => {
    const original = prismaError('P1001')

    expect(toHttpError(original)).toBe(original)
  })

  it('greška koja nije Prisma prolazi nepromenjena', () => {
    const original = new Error('nešto sasvim deseto')

    expect(toHttpError(original)).toBe(original)
  })
})

describe('withPrismaErrors', () => {
  it('vraća vrednost kad nema greške', async () => {
    await expect(withPrismaErrors(() => Promise.resolve(42))).resolves.toBe(42)
  })

  it('prevodi grešku pre nego što je prosledi dalje', async () => {
    await expect(
      withPrismaErrors(() => Promise.reject(prismaError('P2025'))),
    ).rejects.toMatchObject({ status: 404 })
  })
})
