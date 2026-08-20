import { describe, expect, it } from 'vitest'

import { localize } from './localize'

const value = { sr: 'Naslov', en: 'Title' }

describe('localize', () => {
  it('bira srpski za sr', () => {
    expect(localize(value, 'sr')).toBe('Naslov')
  })

  it('bira engleski za en', () => {
    expect(localize(value, 'en')).toBe('Title')
  })

  it('prepoznaje kod sa regionom', () => {
    expect(localize(value, 'en-US')).toBe('Title')
    expect(localize(value, 'sr-Latn-RS')).toBe('Naslov')
  })

  // Bolje srpski nego prazno mesto gde je trebalo da bude naslov
  it('nepoznat jezik pada na srpski, ne na prazno', () => {
    expect(localize(value, 'de')).toBe('Naslov')
    expect(localize(value, '')).toBe('Naslov')
  })
})
