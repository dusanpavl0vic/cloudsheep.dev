import { describe, expect, it } from 'vitest'

import { i18n, loadFeatureNamespace } from './index'

/**
 * Ovaj test postoji zbog konkretne regresije: namespace-ovi su bili podeljeni po feature-u,
 * ali `loadFeatureNamespace` nije bio pozvan ni sa jedne rute. Typecheck je bio čist,
 * testovi su prolazili, a na ekranu je pisalo `insight.stats.uptime` umesto teksta.
 *
 * Zaključavamo ponašanje: svaki feature namespace mora da se učita i da razreši svoje ključeve.
 */
describe('i18n namespace-ovi', () => {
  it('common je dostupan odmah — nosi navigaciju i footer pre prve rute', () => {
    expect(i18n.hasResourceBundle('sr', 'common')).toBe(true)
    expect(i18n.getResource('sr', 'common', 'nav.home')).toBeTruthy()
  })

  it.each(['landing', 'projects', 'contact', 'uses'] as const)(
    'namespace "%s" se učitava i razrešava ključeve na oba jezika',
    async (namespace) => {
      await loadFeatureNamespace(namespace)

      expect(i18n.hasResourceBundle('sr', namespace)).toBe(true)
      expect(i18n.hasResourceBundle('en', namespace)).toBe(true)
    },
  )

  it('landing ključevi se razrešavaju u tekst, ne u sam ključ', async () => {
    await loadFeatureNamespace('landing')

    const uptime = i18n.t('insight.stats.uptime', { ns: 'landing', lng: 'sr' })
    expect(uptime).not.toBe('insight.stats.uptime')
    expect(uptime).toBeTruthy()

    const heroTitle = i18n.t('hero.titleTop', { ns: 'landing', lng: 'sr' })
    expect(heroTitle).not.toBe('hero.titleTop')
  })

  it('ponovljeno učitavanje je no-op, ne dupli fetch', async () => {
    await loadFeatureNamespace('projects')
    await loadFeatureNamespace('projects')

    expect(i18n.hasResourceBundle('sr', 'projects')).toBe(true)
  })

  it('sr i en imaju ISTI skup ključeva u svakom namespace-u', async () => {
    const flatten = (obj: Record<string, unknown>, prefix = ''): string[] =>
      Object.entries(obj).flatMap(([key, value]) =>
        typeof value === 'object' && value !== null
          ? flatten(value as Record<string, unknown>, `${prefix}${key}.`)
          : [`${prefix}${key}`],
      )

    for (const namespace of ['common', 'landing', 'projects', 'contact', 'uses'] as const) {
      if (namespace !== 'common') await loadFeatureNamespace(namespace)

      const sr = flatten(i18n.getResourceBundle('sr', namespace) as Record<string, unknown>).sort()
      const en = flatten(i18n.getResourceBundle('en', namespace) as Record<string, unknown>).sort()

      expect(en, `namespace "${namespace}" se razilazi između sr i en`).toEqual(sr)
    }
  })
})
