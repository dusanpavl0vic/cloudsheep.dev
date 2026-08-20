import { afterEach, describe, expect, it, vi } from 'vitest'

import { featuredLoader, projectLoader, projectsLoader } from './loaders'

const project = (slug: string, isFeatured = false) => ({
  id: slug,
  slug,
  category: 'frontend',
  year: 2025,
  isFeatured,
  mediaSide: 'start',
  galleryLayout: 'grid',
  technologies: [],
  images: [],
  liveUrl: null,
  repoUrl: null,
  title: { sr: slug, en: slug },
  cat: { sr: '', en: '' },
  desc: { sr: '', en: '' },
  caption: { sr: '', en: '' },
})

/**
 * `featuredLoader` zove ČETIRI endpointa paralelno: projekte, tehnologije, profil i tim.
 * Mock odgovara po putanji — inače bi profil dobio oblik liste projekata i zod bi ga odbio.
 */
const respondWith = (items: unknown[], technologies: unknown[] = []) => {
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string) => {
      if (url.includes('/technologies')) return Response.json({ items: technologies })
      if (url.includes('/profile')) return Response.json({ profile: null, links: [] })
      if (url.includes('/team')) return Response.json({ items: [] })
      return Response.json({ items })
    }),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('projectsLoader', () => {
  it('vraća listu sa API-ja', async () => {
    respondWith([project('a'), project('b')])

    await expect(projectsLoader()).resolves.toHaveLength(2)
  })
})

describe('featuredLoader', () => {
  it('vraća i tehnologije, u istom krugu', async () => {
    respondWith(
      [project('a', true)],
      [{ id: 't1', slug: 'react', label: 'React', group: 'frontend', logoUrl: null }],
    )

    const { technologies } = await featuredLoader()

    expect(technologies).toHaveLength(1)
  })

  it('vraća samo izdvojene', async () => {
    respondWith([project('a', true), project('b'), project('c', true)])

    const { featured } = await featuredLoader()

    expect(featured.map((project) => project.slug)).toEqual(['a', 'c'])
  })

  // Granica, ne definicija: šest označenih projekata ne sme da produži početnu u nedogled
  it('seče na tri i kad je izdvojenih više', async () => {
    respondWith([1, 2, 3, 4, 5].map((n) => project(`p${String(n)}`, true)))

    const { featured } = await featuredLoader()
    expect(featured).toHaveLength(3)
  })

  it('nijedan izdvojen daje praznu listu, ne grešku', async () => {
    respondWith([project('a'), project('b')])

    const { featured } = await featuredLoader()
    expect(featured).toEqual([])
  })
})

describe('projectLoader', () => {
  it('nalazi projekat po slugu', async () => {
    respondWith([project('a'), project('b')])

    const data = await projectLoader({ params: { slug: 'b' } })

    expect(data.project.slug).toBe('b')
  })

  it('„sledeći" ide u krug po redosledu iz admina', async () => {
    respondWith([project('a'), project('b'), project('c')])

    const last = await projectLoader({ params: { slug: 'c' } })

    expect(last.next?.slug).toBe('a')
  })

  it('jedini projekat nema „sledeći" — nema šta da se prikaže', async () => {
    respondWith([project('a')])

    const data = await projectLoader({ params: { slug: 'a' } })

    expect(data.next).toBeNull()
  })

  /*
   * Bačen `Response`, ne vraćen `null`.
   *
   * React Router ga hvata kao errorElement i zadržava status, pa nepostojeći projekat daje
   * pravi 404 umesto prazne kutije sa HTTP 200 — što je pretraživač do sada tako i video.
   */
  it('nepoznat slug baca Response 404', async () => {
    respondWith([project('a')])

    await expect(projectLoader({ params: { slug: 'nema-me' } })).rejects.toMatchObject({
      status: 404,
    })
  })

  it('bez sluga baca 404', async () => {
    respondWith([project('a')])

    await expect(projectLoader({ params: {} })).rejects.toMatchObject({ status: 404 })
  })
})
