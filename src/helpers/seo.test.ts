import { describe, expect, it, vi } from 'vitest'

vi.mock('@/constants/env', () => ({ SITE_URL: 'https://cloudsheep.dev' }))

const { buildPageMetadata, localizedPath } = await import('./seo')

describe('localizedPath', () => {
  it('engleski bez prefiksa, srpski pod /sr, početna srpska je /sr (bez kose crte)', () => {
    expect(localizedPath('/projects', 'en')).toBe('/projects')
    expect(localizedPath('/projects', 'sr')).toBe('/sr/projects')
    expect(localizedPath('/', 'sr')).toBe('/sr')
    expect(localizedPath('/', 'en')).toBe('/')
  })
})

describe('buildPageMetadata', () => {
  const meta = buildPageMetadata({ locale: 'sr', path: '/projects/booksphere', title: 'T', description: 'D' })

  it('canonical pokazuje na sopstveni jezik', () => {
    expect(meta.alternates?.canonical).toBe('https://cloudsheep.dev/sr/projects/booksphere')
  })

  it('hreflang: en, sr-Latn i x-default (engleski)', () => {
    expect(meta.alternates?.languages).toEqual({
      en: 'https://cloudsheep.dev/projects/booksphere',
      'sr-Latn': 'https://cloudsheep.dev/sr/projects/booksphere',
      'x-default': 'https://cloudsheep.dev/projects/booksphere',
    })
  })

  it('naslov je apsolutan — layout ga ne dopunjuje šablonom', () => {
    expect(meta.title).toEqual({ absolute: 'T' })
  })
})
