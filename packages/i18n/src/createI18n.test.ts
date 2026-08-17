import { describe, expect, it, vi } from 'vitest'

import { createI18n } from './createI18n'

const resources = {
  sr: {
    common: {
      save: 'Sačuvaj',
      // Srpski ima TRI plural forme — ovo je razlog zašto je ICU uključen
      projects: '{count, plural, one {# projekat} few {# projekta} other {# projekata}}',
      greeting:
        '{gender, select, female {Dobrodošla} male {Dobrodošao} other {Dobrodošli}}, {name}!',
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

describe('sinhronizacija <html lang>', () => {
  it('postavlja atribut ODMAH, bez ijednog poziva changeLanguage', () => {
    // Ovo je test koji je nedostajao. Prva verzija je slušala `initialized`, koji se sa
    // ugrađenim resursima okine pre nego što se slušalac zakači — pa se atribut nikad ne
    // postavi na prvom učitavanju. Svi ostali testovi zovu `changeLanguage` i time
    // slučajno zaobiđu grešku.
    document.documentElement.lang = 'xx'
    make('sr')

    expect(document.documentElement.lang).toBe('sr')
  })

  it('postavlja atribut na početni jezik', async () => {
    const instance = make('sr')
    await instance.changeLanguage('sr')

    expect(document.documentElement.lang).toBe('sr')
  })

  it('menja atribut pri promeni jezika', async () => {
    const instance = make('sr')
    await instance.changeLanguage('en')

    // Bez ovoga screen reader čita engleski tekst srpskim izgovorom
    expect(document.documentElement.lang).toBe('en')
  })

  it('vraća ga nazad — nije jednosmerno', async () => {
    const instance = make('en')
    await instance.changeLanguage('en')
    await instance.changeLanguage('sr')

    expect(document.documentElement.lang).toBe('sr')
  })

  it('bez eksplicitnog `lng` bira jezik detektorom — to je put koji app zaista koristi', () => {
    // Testovi svuda prosleđuju `lng` radi determinizma, pa je produkcijska grana
    // (`lng === undefined`, izbor iz localStorage/navigator) ostajala neproverena.
    const instance = createI18n({ resources, storageKey: 'test.detect' })

    expect(instance.language).toBeTruthy()
    expect(document.documentElement.lang).toBe(instance.resolvedLanguage)
  })

  it('upisuje RAZREŠEN jezik, ne ono što je detektor prijavio', async () => {
    // Pretraživač javlja `en-US`; `nonExplicitSupportedLngs` to razreši na `en` za prevode,
    // pa i atribut mora reći `en` — inače stranica tvrdi jezik koji ne servira.
    const instance = make('sr')
    await instance.changeLanguage('en-US')

    expect(document.documentElement.lang).toBe('en')
  })

  it('ne pada kad DOM ne postoji', () => {
    // Zaštita za okruženja bez `document` (node skripta). Grana se ne može pogoditi u
    // jsdom-u bez ovoga, pa bi inače ostala i nepokrivena i nedokazana.
    vi.stubGlobal('document', undefined)

    expect(() => make('sr')).not.toThrow()

    vi.unstubAllGlobals()
  })
})
