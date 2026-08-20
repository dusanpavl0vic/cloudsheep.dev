import request from 'supertest'
import { describe, expect, it } from 'vitest'

import { createApp } from '../app.ts'

/**
 * Prvi supertest u repou.
 *
 * `createApp()` je od početka izvezen odvojeno od `main.ts` baš zbog ovoga — uzima se
 * objekat aplikacije, bez otvaranja porta, pa testovi mogu paralelno bez sudara.
 *
 * `/health` je namerno izabran kao prvi: jedini je koji NE dodiruje bazu, pa dokazuje da
 * lanac (Express, helmet, cors, error handler, supertest) radi, bez potrebe za Postgresom.
 */
describe('GET /health', () => {
  it('vraća 200 i status', async () => {
    const res = await request(createApp()).get('/health')

    expect(res.status).toBe(200)
    expect(res.body).toEqual({ status: 'ok' })
  })

  it('prolazi bez `Origin` zaglavlja — CORS je zaštita pretraživača, ne autorizacija', async () => {
    const res = await request(createApp()).get('/health')

    expect(res.status).toBe(200)
  })

  it('dozvoljava origin sa allowlist-e', async () => {
    const res = await request(createApp()).get('/health').set('Origin', 'http://localhost:5174')

    expect(res.status).toBe(200)
    expect(res.headers['access-control-allow-origin']).toBe('http://localhost:5174')
  })

  it('helmet je aktivan', async () => {
    const res = await request(createApp()).get('/health')

    expect(res.headers['x-content-type-options']).toBe('nosniff')
  })
})

describe('nepoznata ruta', () => {
  it('vraća 404 sa i18n ključem, ne tekstom', async () => {
    const res = await request(createApp()).get('/nema-me')

    expect(res.status).toBe(404)
    expect(res.body).toEqual({ messageKey: 'errors.notFound' })
  })
})
