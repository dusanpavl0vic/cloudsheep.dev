import { describe, expect, it } from 'vitest'

import { TECH_ITEMS, techIconFor, techTags } from './tech'

describe('techIconFor', () => {
  it('nalazi logotip po tačnom nazivu', () => {
    expect(techIconFor('Next.js')).toBe('/tech/nextjs.svg')
    expect(techIconFor('PostgreSQL')).toBe('/tech/postgresql.svg')
  })

  it('ne zavisi od velikih slova, tačaka ni razmaka', () => {
    // Tagovi projekata su `Node.js`, discipline pišu `node.js` — isti unos
    expect(techIconFor('node.js')).toBe('/tech/nodejs.svg')
    expect(techIconFor('NODEJS')).toBe('/tech/nodejs.svg')
    expect(techIconFor('React Native')).toBe('/tech/reactnative.svg')
    expect(techIconFor('react-native')).toBe('/tech/reactnative.svg')
  })

  it('vraća undefined za tehnologiju bez logotipa', () => {
    // GTFS je format podataka, Stripe nema logotip na disku — oba se crtaju kao čist tekst
    expect(techIconFor('GTFS')).toBeUndefined()
    expect(techIconFor('Stripe')).toBeUndefined()
  })

  it('svaki unos iz spiska nalazi sam sebe', () => {
    for (const item of TECH_ITEMS) {
      expect(techIconFor(item.label)).toBe(item.icon)
    }
  })
})

describe('techTags', () => {
  it('zadržava redosled i dodaje logotip gde postoji', () => {
    expect(techTags(['Next.js', 'GTFS'])).toEqual([
      { label: 'Next.js', icon: '/tech/nextjs.svg' },
      { label: 'GTFS', icon: undefined },
    ])
  })
})
