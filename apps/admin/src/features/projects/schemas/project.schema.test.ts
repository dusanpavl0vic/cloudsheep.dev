import { describe, expect, it } from 'vitest'

import { projectSchema } from './project.schema'

const valid = {
  slug: 'atlas-analytics',
  category: 'fullStack' as const,
  year: 2025,
  titleSr: 'Atlas',
  titleEn: 'Atlas',
  catSr: 'full-stack',
  catEn: 'full-stack',
  descSr: 'Opis',
  descEn: 'Description',
  captionSr: '',
  captionEn: '',
  technologyIds: [],
  galleryLayout: 'grid',
  liveUrl: '',
  repoUrl: '',
  isPublished: true,
  isFeatured: false,
}

/** Vraća i18n ključ prve greške na datom polju. */
const errorOn = (input: Record<string, unknown>, field: string) => {
  const result = projectSchema.safeParse(input)
  if (result.success) return undefined
  return result.error.issues.find((issue) => issue.path[0] === field)?.message
}

describe('projectSchema', () => {
  it('prihvata ispravan projekat', () => {
    expect(projectSchema.safeParse(valid).success).toBe(true)
  })

  describe('slug', () => {
    it.each([
      ['Veliko Slovo', 'projects.errors.slugFormat'],
      ['sa razmakom', 'projects.errors.slugFormat'],
      ['crtica-na-kraju-', 'projects.errors.slugFormat'],
      ['-crtica-na-pocetku', 'projects.errors.slugFormat'],
      ['dve--crtice', 'projects.errors.slugFormat'],
      ['', 'projects.errors.required'],
    ])('odbija %j', (slug, expected) => {
      expect(errorOn({ ...valid, slug }, 'slug')).toBe(expected)
    })

    it.each(['atlas', 'atlas-analytics', 'projekat-2', 'a1'])('prihvata %j', (slug) => {
      expect(errorOn({ ...valid, slug }, 'slug')).toBeUndefined()
    })
  })

  describe('godina', () => {
    it('odbija godinu pre 2000', () => {
      expect(errorOn({ ...valid, year: 1999 }, 'year')).toBe('projects.errors.yearRange')
    })

    // Projekat najavljen pet godina unapred je greška u kucanju, ne podatak
    it('odbija godinu daleko u budućnosti', () => {
      expect(errorOn({ ...valid, year: new Date().getFullYear() + 5 }, 'year')).toBe(
        'projects.errors.yearRange',
      )
    })

    it('prihvata sledeću godinu', () => {
      expect(errorOn({ ...valid, year: new Date().getFullYear() + 1 }, 'year')).toBeUndefined()
    })

    it('odbija tekst — konverziju radi valueAsNumber, ne šema', () => {
      expect(errorOn({ ...valid, year: '2025' }, 'year')).toBe('projects.errors.yearInvalid')
    })
  })

  describe('linkovi', () => {
    // Projekat bez live linka je uobičajen — prazno polje NIJE greška
    it('prihvata prazan URL', () => {
      expect(errorOn({ ...valid, liveUrl: '', repoUrl: '' }, 'liveUrl')).toBeUndefined()
    })

    it('odbija neispravan URL', () => {
      expect(errorOn({ ...valid, liveUrl: 'nije-url' }, 'liveUrl')).toBe(
        'projects.errors.urlInvalid',
      )
    })

    it('prihvata ispravan URL', () => {
      expect(errorOn({ ...valid, liveUrl: 'https://primer.dev' }, 'liveUrl')).toBeUndefined()
    })
  })

  describe('obavezna dvojezična polja', () => {
    it.each(['titleSr', 'titleEn', 'catSr', 'catEn', 'descSr', 'descEn'])(
      '%s ne sme biti prazno',
      (field) => {
        expect(errorOn({ ...valid, [field]: '' }, field)).toBe('projects.errors.required')
      },
    )

    it('sam razmak se ne računa kao unos', () => {
      expect(errorOn({ ...valid, titleSr: '   ' }, 'titleSr')).toBe('projects.errors.required')
    })
  })

  it('poruke su i18n ključevi, ne tekst', () => {
    const result = projectSchema.safeParse({ ...valid, slug: '', titleSr: '' })
    if (result.success) throw new Error('očekivana je greška')

    for (const issue of result.error.issues) {
      expect(issue.message).toMatch(/^projects\.errors\./)
    }
  })
})
