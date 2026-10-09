import { Prisma } from '@prisma/client'
import { NextRequest } from 'next/server'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { HttpError, readJson, readPatch, toErrorResponse } from './http'

const request = (raw: string) =>
  new NextRequest('http://localhost/api/x', {
    method: 'POST',
    body: raw,
    headers: { 'content-type': 'application/json' },
  })

const body = async (response: Response) => (await response.json()) as Record<string, unknown>

describe('toErrorResponse', () => {
  it('HttpError → svoj status i ključ', async () => {
    const response = toErrorResponse(new HttpError(422, 'email.errors.noMx', { field: 'email' }))
    expect(response.status).toBe(422)
    expect(await body(response)).toEqual({
      messageKey: 'email.errors.noMx',
      details: { field: 'email' },
    })
  })

  it('jedinstven ključ u bazi → 409 sa poljem', async () => {
    const error = new Prisma.PrismaClientKnownRequestError('unique', {
      code: 'P2002',
      clientVersion: 'x',
      meta: { target: ['slug'] },
    })
    const response = toErrorResponse(error)
    expect(response.status).toBe(409)
    expect(await body(response)).toEqual({
      messageKey: 'errors.conflict',
      details: { field: 'slug' },
    })
  })

  it('nepoznata greška → 500 BEZ poruke i stack-a', async () => {
    const response = toErrorResponse(new Error('connect ECONNREFUSED 10.0.0.5:5432'))
    expect(response.status).toBe(500)
    const text = JSON.stringify(await body(response))
    expect(text).not.toContain('ECONNREFUSED')
    expect(text).toBe('{"messageKey":"errors.unexpected"}')
  })
})

describe('readJson', () => {

  it('neispravno telo → 400 sa prvim krivim poljem', async () => {
    await expect(
      readJson(request('{"name":""}'), z.object({ name: z.string().min(1) }), 'x.invalid'),
    ).rejects.toMatchObject({
      status: 400,
      messageKey: 'x.invalid',
      details: { field: 'name' },
    })
  })

  it('JSON koji se ne parsira → 400', async () => {
    await expect(readJson(request('{nije json'), z.object({}))).rejects.toMatchObject({
      status: 400,
    })
  })
})

describe('readPatch', () => {
  const schema = z
    .object({ title: z.string(), company: z.string().default(''), tags: z.array(z.string()).default([]), isPublished: z.boolean() })
    .partial()

  it('vraća samo poslate ključeve — podrazumevane vrednosti ne brišu ostala polja', async () => {
    expect(await readPatch(request('{"isPublished":true}'), schema)).toEqual({ isPublished: true })
  })

  it('poslata prazna vrednost ostaje (namerno brisanje polja)', async () => {
    expect(await readPatch(request('{"company":""}'), schema)).toEqual({ company: '' })
  })

  it('i dalje validira poslata polja', async () => {
    await expect(readPatch(request('{"title":1}'), schema, 'x.invalid')).rejects.toMatchObject({
      status: 400,
      messageKey: 'x.invalid',
    })
  })
})
