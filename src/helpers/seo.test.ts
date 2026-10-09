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

describe('JSON-LD', async () => {
  const { breadcrumbJsonLd, projectJsonLd } = await import('./seo')

  it('studija slučaja: apsolutna adresa na jeziku stranice i relativna slika postaje apsolutna', () => {
    const data = projectJsonLd({ locale: 'sr', path: '/projects/x', title: 'X', description: 'D', year: 2025, image: '/uploads/a.png', keywords: ['React'], studio: 'CloudSheep' })
    expect(data.url).toBe('https://cloudsheep.dev/sr/projects/x')
    expect(data.image).toBe('https://cloudsheep.dev/uploads/a.png')
    expect(data.keywords).toBe('React')
  })

  it('breadcrumb numeriše od 1', () => {
    const data = breadcrumbJsonLd('en', [{ name: 'Home', path: '/' }, { name: 'Work', path: '/projects' }])
    expect(data.itemListElement.map((i) => [i.position, i.item])).toEqual([
      [1, 'https://cloudsheep.dev/'],
      [2, 'https://cloudsheep.dev/projects'],
    ])
  })
})
