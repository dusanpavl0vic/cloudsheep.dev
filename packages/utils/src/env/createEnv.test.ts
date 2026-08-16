import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { createEnv } from './createEnv'

const schema = z.object({
  VITE_APP_ENV: z.enum(['development', 'test', 'production']),
  VITE_API_URL: z.url(),
})

describe('createEnv', () => {
  it('vraća tipiziran objekat za ispravan ulaz', () => {
    const env = createEnv(schema, {
      VITE_APP_ENV: 'production',
      VITE_API_URL: 'https://api.cloudsheep.dev',
    })

    expect(env.VITE_APP_ENV).toBe('production')
    expect(env.VITE_API_URL).toBe('https://api.cloudsheep.dev')
  })

  it('baca kad obavezna promenljiva fali', () => {
    expect(() => createEnv(schema, { VITE_APP_ENV: 'test' })).toThrow(/VITE_API_URL/)
  })

  it('baca kad vrednost ne odgovara šemi', () => {
    expect(() =>
      createEnv(schema, { VITE_APP_ENV: 'staging', VITE_API_URL: 'https://a.rs' }),
    ).toThrow(/VITE_APP_ENV/)
  })

  it('baca kad URL nije URL', () => {
    expect(() =>
      createEnv(schema, { VITE_APP_ENV: 'test', VITE_API_URL: 'nije-url' }),
    ).toThrow(/VITE_API_URL/)
  })

  it('poruka nabraja sve probleme odjednom, ne samo prvi', () => {
    let message = ''
    try {
      createEnv(schema, {})
    } catch (error) {
      message = (error as Error).message
    }

    expect(message).toContain('VITE_APP_ENV')
    expect(message).toContain('VITE_API_URL')
    expect(message).toContain('.env.example')
  })

  it('označava koren kad greška nije vezana za polje', () => {
    expect(() => createEnv(z.string(), 42)).toThrow(/\(koren\)/)
  })
})
