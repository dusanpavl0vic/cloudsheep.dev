import { describe, expect, it } from 'vitest'

import {
  DEFAULT_LOCALE,
  getLanguage,
  isSupportedLocale,
  LANGUAGES,
  SUPPORTED_LOCALES,
} from './languages'

describe('registry jezika', () => {
  it('sadrži srpski i engleski', () => {
    expect(SUPPORTED_LOCALES).toEqual(['sr', 'en'])
  })

  it('podrazumevani jezik je srpski i postoji u registru', () => {
    expect(DEFAULT_LOCALE).toBe('sr')
    expect(SUPPORTED_LOCALES).toContain(DEFAULT_LOCALE)
  })

  it('srpski koristi latinicu za Intl — bez -Latn Intl bira ćirilicu', () => {
    expect(getLanguage('sr').intlLocale).toBe('sr-Latn-RS')
  })

  it('svaki jezik ima popunjena sva polja', () => {
    for (const language of LANGUAGES) {
      expect(language.code).toBeTruthy()
      expect(language.label).toBeTruthy()
      expect(language.short).toBeTruthy()
      expect(language.intlLocale).toBeTruthy()
      expect(['ltr', 'rtl']).toContain(language.dir)
    }
  })

  it('kodovi su jedinstveni', () => {
    expect(new Set(SUPPORTED_LOCALES).size).toBe(SUPPORTED_LOCALES.length)
  })
})

describe('getLanguage', () => {
  it('vraća traženi jezik', () => {
    expect(getLanguage('en').label).toBe('English')
  })

  it('pada na podrazumevani za nepoznat kod', () => {
    expect(getLanguage('de').code).toBe(DEFAULT_LOCALE)
  })

  it('pada na podrazumevani za prazan kod', () => {
    expect(getLanguage('').code).toBe(DEFAULT_LOCALE)
  })
})

describe('isSupportedLocale', () => {
  it.each(['sr', 'en'])('prihvata %s', (code) => {
    expect(isSupportedLocale(code)).toBe(true)
  })

  it.each(['de', 'SR', '', 'sr-RS'])('odbija %s', (code) => {
    expect(isSupportedLocale(code)).toBe(false)
  })
})
