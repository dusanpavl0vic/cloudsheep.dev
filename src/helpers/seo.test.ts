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
  it('engleska stranica: canonical na sebe, indeksira se, bez hreflang-a', () => {
    const meta = buildPageMetadata({
      locale: 'en',
      path: '/projects/booksphere',
      title: 'T',
      description: 'D',
    })
    expect(meta.alternates).toEqual({ canonical: 'https://cloudsheep.dev/projects/booksphere' })
    expect(meta.robots).toBeUndefined()
  })

  it('srpska stranica: noindex, follow — u pretrazi je samo engleski (ADR 0012)', () => {
    const meta = buildPageMetadata({
      locale: 'sr',
      path: '/projects/booksphere',
      title: 'T',
      description: 'D',
    })
    expect(meta.alternates).toEqual({ canonical: 'https://cloudsheep.dev/sr/projects/booksphere' })
    expect(meta.robots).toEqual({ index: false, follow: true })
  })

  it('bez slike stranica dobija og.png i ime sajta — Next ne spaja openGraph sa layout-om', () => {
    const meta = buildPageMetadata({
      locale: 'en',
      path: '/projects',
      title: 'Work',
      description: 'D',
    })
    expect(meta.openGraph).toMatchObject({
      siteName: 'CloudSheep',
      images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Work' }],
    })
    expect(meta.twitter).toMatchObject({ images: ['/og.png'] })
  })

  it('sopstvena slika (studija slučaja) zamenjuje podrazumevanu', () => {
    const image = { url: '/uploads/a.png', width: 800, height: 600, alt: 'A' }
    const meta = buildPageMetadata({
      locale: 'en',
      path: '/projects/a',
      title: 'A',
      description: 'D',
      image,
    })
    expect(meta.openGraph).toMatchObject({ images: [image] })
  })

  it('naslov je apsolutan — layout ga ne dopunjuje šablonom', () => {
    expect(
      buildPageMetadata({ locale: 'en', path: '/', title: 'T', description: 'D' }).title,
    ).toEqual({ absolute: 'T' })
  })
})

describe('JSON-LD', async () => {
  const { breadcrumbJsonLd, projectJsonLd } = await import('./seo')

  it('studija slučaja: apsolutna adresa na jeziku stranice i relativna slika postaje apsolutna', () => {
    const data = projectJsonLd({
      locale: 'sr',
      path: '/projects/x',
      title: 'X',
      description: 'D',
      year: 2025,
      image: '/uploads/a.png',
      keywords: ['React'],
      studio: 'CloudSheep',
    })
    expect(data.url).toBe('https://cloudsheep.dev/sr/projects/x')
    expect(data.image).toBe('https://cloudsheep.dev/uploads/a.png')
    expect(data.keywords).toBe('React')
  })

  it('breadcrumb numeriše od 1', () => {
    const data = breadcrumbJsonLd('en', [
      { name: 'Home', path: '/' },
      { name: 'Work', path: '/projects' },
    ])
    expect(data.itemListElement.map((i) => [i.position, i.item])).toEqual([
      [1, 'https://cloudsheep.dev/'],
      [2, 'https://cloudsheep.dev/projects'],
    ])
  })
})
