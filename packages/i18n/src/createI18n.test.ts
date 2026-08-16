import { describe, expect, it } from 'vitest'

import { createI18n } from './createI18n'

const resources = {
  sr: {
    common: {
      save: 'Sačuvaj',
      // Srpski ima TRI plural forme — ovo je razlog zašto je ICU uključen
      projects: '{count, plural, one {# projekat} few {# projekta} other {# projekata}}',
      greeting: '{gender, select, female {Dobrodošla} male {Dobrodošao} other {Dobrodošli}}, {name}!',
    },
  },
  en: {
    common: {
      save: 'Save',
      projects: '{count, plural, one {# project} other {# projects}}',
      greeting: 'Welcome, {name}!',
    },
  },
}

const make = (lng: string) => createI18n({ resources, storageKey: 'test.lang', lng })

describe('createI18n', () => {
  it('prevodi na srpski', () => {
    expect(make('sr').t('save')).toBe('Sačuvaj')
  })

  it('prevodi na engleski', () => {
    expect(make('en').t('save')).toBe('Save')
  })

  it('cimode vraća ključ umesto prevoda — tako testiramo UI', () => {
    expect(make('cimode').t('save')).toBe('save')
  })

  it('nepoznat ključ vraća sam ključ, ne prazan string', () => {
    expect(make('sr').t('nema.ovog.kljuca')).toBe('nema.ovog.kljuca')
  })
})

describe('ICU plural za srpski — sve tri forme', () => {
  const i18n = make('sr')

  it.each([
    [1, '1 projekat'],
    [21, '21 projekat'],
    [101, '101 projekat'],
  ])('one: %i → %s', (count, expected) => {
    expect(i18n.t('projects', { count })).toBe(expected)
  })

  it.each([
    [2, '2 projekta'],
    [3, '3 projekta'],
    [4, '4 projekta'],
    [22, '22 projekta'],
  ])('few: %i → %s', (count, expected) => {
    expect(i18n.t('projects', { count })).toBe(expected)
  })

  it.each([
    [0, '0 projekata'],
    [5, '5 projekata'],
    [11, '11 projekata'],
    [25, '25 projekata'],
  ])('other: %i → %s', (count, expected) => {
    expect(i18n.t('projects', { count })).toBe(expected)
  })
})

describe('ICU plural za engleski — dve forme', () => {
  const i18n = make('en')

  it('one', () => {
    expect(i18n.t('projects', { count: 1 })).toBe('1 project')
  })

  it.each([0, 2, 5, 21])('other: %i', (count) => {
    expect(i18n.t('projects', { count })).toContain('projects')
  })
})

describe('ICU select za rod', () => {
  const i18n = make('sr')

  it.each([
    ['female', 'Dobrodošla, Ana!'],
    ['male', 'Dobrodošao, Marko!'],
    ['other', 'Dobrodošli, Gost!'],
  ])('%s', (gender, expected) => {
    const name = expected.split(', ')[1]?.replace('!', '') ?? ''
    expect(i18n.t('greeting', { gender, name })).toBe(expected)
  })
})

describe('fallback', () => {
  it('nepodržan jezik pada na srpski', () => {
    expect(make('de').t('save')).toBe('Sačuvaj')
  })

  it('regionalna varijanta pada na osnovni jezik', () => {
    expect(make('sr-RS').t('save')).toBe('Sačuvaj')
  })

  it('svaka instanca je nezavisna — createInstance, ne globalni i18next', () => {
    const sr = make('sr')
    const en = make('en')
    expect(sr.t('save')).toBe('Sačuvaj')
    expect(en.t('save')).toBe('Save')
  })
})
