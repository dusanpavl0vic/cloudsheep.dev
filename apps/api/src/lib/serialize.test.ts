import { describe, expect, it } from 'vitest'

import { adminCv, adminProject, publicProject, publicTechnology } from './serialize.ts'
import type { MemberWithCv, ProjectWithRelations } from './serialize.ts'

/*
 * Fixture je ručno sklopljen i kastovan: Prisma tipovi nose kolone koje serijalizacija ne
 * dodiruje, a nabrajanje svake od njih pravi test koji puca na migraciju umesto na promenu
 * ponašanja. Ovde se proverava GRANICA — šta izlazi napolje i u kom obliku.
 */
const tech = (overrides: Record<string, unknown> = {}) => ({
  id: 't1',
  slug: 'react',
  label: 'React',
  group: 'frontend',
  logo: { storageKey: 'react.webp' },
  ...overrides,
})

const project = (overrides: Record<string, unknown> = {}) =>
  ({
    id: 'p1',
    slug: 'booksphere',
    category: 'web',
    year: 2025,
    sortOrder: 3,
    isFeatured: true,
    isPublished: true,
    galleryLayout: 'grid',
    liveUrl: 'https://primer.dev',
    repoUrl: null,
    titleSr: 'Naslov',
    titleEn: 'Title',
    catSr: 'Veb',
    catEn: 'Web',
    descSr: 'Opis',
    descEn: 'Description',
    captionSr: 'Potpis',
    captionEn: 'Caption',
    technologies: [{ sortOrder: 0, technology: tech() }],
    images: [
      {
        id: 'i1',
        altSr: 'Slika',
        altEn: 'Image',
        sortOrder: 1,
        asset: { storageKey: 'slika.webp', width: 1200, height: 800 },
      },
    ],
    updatedAt: new Date('2026-01-01'),
    /** Interno polje — smisao testa je da ga NIJEDAN serijalizator ne pusti napolje. */
    internalNote: 'ne sme napolje',
    ...overrides,
  }) as unknown as ProjectWithRelations

describe('publicTechnology', () => {
  it('logotip postaje puna adresa', () => {
    expect(publicTechnology(tech() as never).logoUrl).toMatch(/\/uploads\/react\.webp$/)
  })

  it('bez logotipa vraća `null`, a ne adresu u prazno', () => {
    expect(publicTechnology(tech({ logo: null }) as never).logoUrl).toBeNull()
  })
})

describe('publicProject', () => {
  it('dvojezična polja se grupišu po polju, ne po jeziku', () => {
    const out = publicProject(project())

    expect(out.title).toEqual({ sr: 'Naslov', en: 'Title' })
    expect(out.desc).toEqual({ sr: 'Opis', en: 'Description' })
  })

  it('slika nosi dimenzije — bez njih `<img>` poskakuje dok se učitava', () => {
    expect(publicProject(project()).images[0]).toMatchObject({ width: 1200, height: 800 })
  })

  it('nabrajanje polja je granica: nepoznato polje iz šeme NE izlazi', () => {
    expect(publicProject(project())).not.toHaveProperty('internalNote')
  })

  it('javni oblik ne odaje interne redoslede ni status objave', () => {
    const out = publicProject(project())

    expect(out).not.toHaveProperty('sortOrder')
    expect(out).not.toHaveProperty('isPublished')
  })

  it('prazne kolekcije prolaze bez grananja', () => {
    const out = publicProject(project({ technologies: [], images: [] }))

    expect(out.technologies).toEqual([])
    expect(out.images).toEqual([])
  })
})

describe('adminProject', () => {
  it('oblik je RAVAN — forma ima ravna polja', () => {
    const out = adminProject(project())

    expect(out.titleSr).toBe('Naslov')
    expect(out).not.toHaveProperty('title')
  })

  it('šalje i id-eve tehnologija, jer forma bira iz spiska umesto da kuca nazive', () => {
    expect(adminProject(project()).technologyIds).toEqual(['t1'])
  })

  it('slika nosi i alt po jeziku i redosled — to admin uređuje', () => {
    expect(adminProject(project()).images[0]).toMatchObject({
      altSr: 'Slika',
      altEn: 'Image',
      sortOrder: 1,
    })
  })

  it('ni admin oblik ne propušta nepoznato polje', () => {
    expect(adminProject(project())).not.toHaveProperty('internalNote')
  })
})

const member = (overrides: Record<string, unknown> = {}) =>
  ({
    id: 'm1',
    fullName: 'Dušan Pavlović',
    roleSr: 'Razvoj',
    roleEn: 'Development',
    email: 'a@b.c',
    phone: '',
    githubUrl: '',
    linkedinUrl: '',
    websiteUrl: '',
    locationSr: 'Niš',
    locationEn: 'Nish',
    summarySr: 'Sažetak',
    summaryEn: 'Summary',
    hasDiploma: true,
    universitySr: 'Univerzitet u Nišu',
    universityEn: 'University of Niš',
    degreeSr: 'Diplomirani inženjer',
    degreeEn: 'Graduate Engineer',
    programmeSr: 'Računarstvo',
    programmeEn: 'Computer Science',
    facultySr: 'Elektronski fakultet',
    facultyEn: 'Faculty of Electronic Engineering',
    city: 'Niš',
    educationStatusSr: 'Student',
    educationStatusEn: 'Student',
    gpa: '8.57/10.0',
    educationStartYear: 2020,
    educationEndYear: 2025,
    cvExperiences: [],
    cvLanguages: [],
    cvSiteProjects: [],
    ...overrides,
  }) as unknown as MemberWithCv

describe('adminCv', () => {
  it('vraća `memberId`, jer forma šalje izmene nazad na člana', () => {
    expect(adminCv(member()).memberId).toBe('m1')
  })

  it('polja diplome idu i ovde — CV se uređuje bez skoka na ekran člana', () => {
    expect(adminCv(member())).toMatchObject({
      hasDiploma: true,
      programmeSr: 'Računarstvo',
      city: 'Niš',
    })
  })

  it('iskustvo zadržava oba jezika — prevod je posao forme, ne serijalizacije', () => {
    const out = adminCv(
      member({
        cvExperiences: [
          {
            company: 'Tremium',
            positionSr: 'Junior',
            positionEn: 'Junior',
            locationSr: 'Niš',
            locationEn: 'Nish',
            startYear: 2025,
            startMonth: 1,
            endYear: null,
            endMonth: null,
            summarySr: 'S',
            summaryEn: 'S',
            bulletsSr: ['a'],
            bulletsEn: ['b'],
            technologies: ['.NET'],
            sortOrder: 0,
          },
        ],
      }),
    )

    expect(out.experiences[0]).toMatchObject({ company: 'Tremium', bulletsSr: ['a'] })
  })

  it('`sortOrder` se NE šalje — pozicija u nizu je jedini izvor redosleda', () => {
    const out = adminCv(
      member({
        cvLanguages: [
          { nameSr: 'Engleski', nameEn: 'English', levelSr: 'B2', levelEn: 'B2', sortOrder: 7 },
        ],
      }),
    )

    expect(out.languages[0]).toEqual({
      nameSr: 'Engleski',
      nameEn: 'English',
      levelSr: 'B2',
      levelEn: 'B2',
    })
  })

  it('projekat sa sajta šalje `projectId`, ne kopiju podataka', () => {
    const out = adminCv(
      member({
        cvSiteProjects: [
          {
            projectId: 'p1',
            noteSr: 'Napomena',
            noteEn: 'Note',
            project: project(),
          },
        ],
      }),
    )

    expect(out.siteProjects[0]).toMatchObject({
      projectId: 'p1',
      title: 'Naslov',
      year: 2025,
      summary: 'Opis',
      technologies: ['React'],
      noteSr: 'Napomena',
    })
  })

  it('kad srpski naslov nedostaje, pada na engleski umesto da ostane prazan red', () => {
    const out = adminCv(
      member({
        cvSiteProjects: [
          {
            projectId: 'p1',
            noteSr: '',
            noteEn: '',
            project: project({ titleSr: '', descSr: '' }),
          },
        ],
      }),
    )

    expect(out.siteProjects[0]).toMatchObject({ title: 'Title', summary: 'Description' })
  })
})
