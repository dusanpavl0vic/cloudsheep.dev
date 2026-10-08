import { describe, expect, it } from 'vitest'

import { rateLimit } from './rateLimit'

describe('rateLimit', () => {
  it('propušta do granice, pa vraća 429', () => {
    const limit = rateLimit({ name: 'test', limit: 2, windowMs: 60_000, enabled: () => true })
    limit('1.2.3.4')
    limit('1.2.3.4')
    expect(() => {
      limit('1.2.3.4')
    }).toThrow(expect.objectContaining({ status: 429 }))
  })

  it('broji odvojeno po ključu', () => {
    const limit = rateLimit({ name: 'test-keys', limit: 1, windowMs: 60_000, enabled: () => true })
    limit('a')
    expect(() => {
      limit('b')
    }).not.toThrow()
  })
})
