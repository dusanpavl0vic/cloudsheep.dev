import { describe, expect, it, vi } from 'vitest'

import type { MemberWithCv } from '../serialize.ts'
import { localizeCv } from './localize.ts'

/*
 * Fixture se gradi ručno i kastuje, umesto da se sastavlja pun Prisma tip: `MemberWithCv`
 * nosi desetine kolona koje `localizeCv` nikad ne dodirne, a nabrajanje svake od njih pravi
 * test koji puca na svaku migraciju umesto na stvarnu promenu ponašanja.
 */
const member = (overrides: Record<string, unknown> = {}) =>
  ({
    fullName: 'Dušan Pavlović',
    roleSr: 'Razvoj',
    roleEn: 'Development',
    email: '',
    phone: '',
    githubUrl: '',
    linkedinUrl: '',
    websiteUrl: '',
    locationSr: '',
    locationEn: '',
    summarySr: 'Sažetak',
    summaryEn: 'Summary',
    hasDiploma: false,
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

const experience = (overrides: Record<string, unknown> = {}) => ({
  company: 'Tremium Software',
  positionSr: 'Junior inženjer',
  positionEn: 'Junior Engineer',
  locationSr: 'Niš',
  locationEn: 'Nish',
  startYear: 2025,
  startMonth: 1,
  endYear: 2025,
  endMonth: 3,
  summarySr: 'Sažetak posla',
  summaryEn: 'Job summary',
  bulletsSr: ['Radio na API-jima.'],
  bulletsEn: ['Worked on APIs.'],
  technologies: ['.NET'],
  ...overrides,
})

const siteProject = (overrides: Record<string, unknown> = {}) => ({
  noteSr: 'Napomena',
  noteEn: 'Note',
  project: {
    titleSr: 'BookSphere',
    titleEn: 'BookSphere',
    descSr: 'Opis',
    descEn: 'Description',
    year: 2025,
    liveUrl: 'https://primer.dev',
    repoUrl: null,
    technologies: [{ technology: { label: 'React' } }],
  },
  ...overrides,
})

describe('localizeCv — izbor jezika', () => {
  it('bira srpsku stranu para', () => {
    const doc = localizeCv(member(), 'sr')
    expect(doc.role).toBe('Razvoj')
    expect(doc.summary).toBe('Sažetak')
  })

  it('bira englesku stranu para', () => {
    const doc = localizeCv(member(), 'en')
    expect(doc.role).toBe('Development')
    expect(doc.summary).toBe('Summary')
  })

  it('ime se ne prevodi', () => {
    expect(localizeCv(member(), 'en').fullName).toBe('Dušan Pavlović')
  })
})

describe('localizeCv — kontakt', () => {
  it('prazna polja se ne dodaju', () => {
    expect(localizeCv(member(), 'sr').contact).toEqual([])
  })

  it('mejl i telefon dobijaju svoje sheme', () => {
    const doc = localizeCv(member({ email: 'a@b.c', phone: '+381' }), 'sr')

    expect(doc.contact).toEqual([
      { label: 'email', value: 'a@b.c', link: 'mailto:a@b.c' },
      { label: 'phone', value: '+381', link: 'tel:+381' },
    ])
  })

  it('lokacija ide bez linka i po jeziku', () => {
    const m = member({ locationSr: 'Niš, Srbija', locationEn: 'Niš, Serbia' })

    expect(localizeCv(m, 'sr').contact[0]).toEqual({ label: 'location', value: 'Niš, Srbija' })
    expect(localizeCv(m, 'en').contact[0]?.value).toBe('Niš, Serbia')
  })

  it('adrese se prikazuju bez sheme, ali link zadržava punu', () => {
    const doc = localizeCv(
      member({ githubUrl: 'https://github.com/x', websiteUrl: 'http://c.dev' }),
      'sr',
    )

    expect(doc.contact).toEqual([
      { label: '', value: 'github.com/x', link: 'https://github.com/x' },
      { label: '', value: 'c.dev', link: 'http://c.dev' },
    ])
  })
})

describe('localizeCv — obrazovanje', () => {
  it('bez diplome nema ni sekcije', () => {
    expect(localizeCv(member({ hasDiploma: false }), 'sr').education).toBeNull()
  })

  it('sa diplomom se polja prevode, a grad ne', () => {
    const doc = localizeCv(member({ hasDiploma: true }), 'en')

    expect(doc.education).toMatchObject({
      university: 'University of Niš',
      programme: 'Computer Science',
      city: 'Niš',
      years: '2020 — 2025',
    })
  })

  it.each([
    [2020, 2025, '2020 — 2025'],
    [2020, null, '2020'],
    [null, 2025, '2025'],
    [null, null, ''],
  ])('godine studija %s/%s → "%s"', (from, to, expected) => {
    const m = member({ hasDiploma: true, educationStartYear: from, educationEndYear: to })
    expect(localizeCv(m, 'sr').education?.years).toBe(expected)
  })
})

describe('localizeCv — iskustvo', () => {
  it('raspon i trajanje se računaju iz datuma', () => {
    const doc = localizeCv(member({ cvExperiences: [experience()] }), 'sr')

    expect(doc.experiences[0]).toMatchObject({
      company: 'Tremium Software',
      position: 'Junior inženjer',
      range: 'jan 2025 — mar 2025',
      duration: '3 meseca',
    })
  })

  it('stavke se biraju po jeziku', () => {
    const m = member({ cvExperiences: [experience()] })

    expect(localizeCv(m, 'sr').experiences[0]?.bullets).toEqual(['Radio na API-jima.'])
    expect(localizeCv(m, 'en').experiences[0]?.bullets).toEqual(['Worked on APIs.'])
  })

  it('bez iskustva zbir je prazan string, ne „0 meseci"', () => {
    expect(localizeCv(member(), 'sr').totalExperience).toBe('')
  })

  it('zbir sabira mesece po poslu, pa pauza između njih ne ulazi u račun', () => {
    const m = member({
      cvExperiences: [
        experience({ startYear: 2020, startMonth: 1, endYear: 2020, endMonth: 6 }),
        experience({ startYear: 2024, startMonth: 1, endYear: 2024, endMonth: 6 }),
      ],
    })

    // 6 + 6, a ne 54 koliko bi dala razlika od prvog do poslednjeg datuma
    expect(localizeCv(m, 'sr').totalExperience).toBe('1 godina')
  })

  it('otvoren kraj se računa do danas', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2026-03-15T00:00:00Z'))

    const m = member({
      cvExperiences: [
        experience({ startYear: 2026, startMonth: 1, endYear: null, endMonth: null }),
      ],
    })

    expect(localizeCv(m, 'sr').experiences[0]?.range).toBe('jan 2026 — danas')
    expect(localizeCv(m, 'sr').experiences[0]?.duration).toBe('3 meseca')
    vi.useRealTimers()
  })
})

describe('localizeCv — projekti i jezici', () => {
  it('projekat sa sajta nosi naziv, tehnologije i samo postojeće linkove', () => {
    const doc = localizeCv(member({ cvSiteProjects: [siteProject()] }), 'sr')

    expect(doc.projects[0]).toMatchObject({
      name: 'BookSphere',
      summary: 'Opis',
      note: 'Napomena',
      year: 2025,
      technologies: ['React'],
      links: ['https://primer.dev'],
      bullets: [],
    })
  })

  it('projekat bez ijednog linka daje prazan niz, ne niz sa `null`', () => {
    const sp = siteProject()
    const m = member({
      cvSiteProjects: [{ ...sp, project: { ...sp.project, liveUrl: null, repoUrl: null } }],
    })

    expect(localizeCv(m, 'sr').projects[0]?.links).toEqual([])
  })

  it('jezici se prevode u oba polja', () => {
    const m = member({
      cvLanguages: [{ nameSr: 'Engleski', nameEn: 'English', levelSr: 'B2', levelEn: 'B2' }],
    })

    expect(localizeCv(m, 'en').languages).toEqual([{ name: 'English', level: 'B2' }])
  })
})
