import { describe, expect, it } from 'vitest'

import { isEmpty, omit, pick, pickPaths } from './object'

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

describe('pickPaths', () => {
  const source = { home: { estimator: { title: 'T' }, faq: { q: 'Q' } }, nav: { home: 'H' } }

  it('čuva ugnežđenost i spaja putanje sa istim korenom', () => {
    expect(pickPaths(source, ['home.estimator', 'nav'])).toEqual({ home: { estimator: { title: 'T' } }, nav: { home: 'H' } })
    expect(pickPaths(source, ['home.estimator', 'home.faq'])).toEqual({ home: source.home })
  })

  it('preskače nepostojeću putanju', () => {
    expect(pickPaths(source, ['home.nope', 'x'])).toEqual({})
  })
})
