import { describe, expect, it } from 'vitest'

import { isEmpty, omit, pick } from './object'

describe('object helpers', () => {
  it('pick zadržava samo navedene ključeve', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 })
  })

  it('omit izbacuje navedene ključeve', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 })
  })

  it('isEmpty', () => {
    expect(isEmpty({})).toBe(true)
    expect(isEmpty({ a: undefined })).toBe(false)
  })
})
