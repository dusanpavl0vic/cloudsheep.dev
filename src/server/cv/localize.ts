import { formatDuration, formatRange, monthsBetween, type CvLang } from './labels'
import type { MemberWithCv } from '../services/includes'

/**
 * CV sveden na JEDAN jezik.
 *
 * Renderer ne vidi `Sr`/`En` parove — dobija gotove stringove. Time se odluka o jeziku
 * donosi jednom, na jednom mestu, umesto da svaki `doc.text` bira između dva polja i da
 * se negde promaši.
 */
export interface CvDoc {
  fullName: string
  role: string

  contact: { label: string; value: string; link?: string }[]
  summary: string

  education: {
    status: string
    university: string
    degree: string
    programme: string
    faculty: string
    city: string
    gpa: string
    years: string
  } | null

  experiences: {
    company: string
    position: string
    location: string
    range: string
    /** „8 meseci" / „2 godine 3 meseca" — računa se iz datuma, ne unosi. */
    duration: string
    summary: string
    bullets: string[]
    technologies: string[]
  }[]
  /** Zbir svih zaposlenja. Prazan string kad iskustva nema. */
  totalExperience: string

  projects: {
    name: string
    summary: string
    bullets: string[]
    technologies: string[]
    note: string
    year: number | null
    links: string[]
  }[]

  languages: { name: string; level: string }[]
}

const pick = (sr: string, en: string, lang: CvLang) => (lang === 'sr' ? sr : en)

/** Godine studija: „2020 — 2025", ili samo jedna, ili ništa. */
const studyYears = (from: number | null, to: number | null): string => {
  if (from !== null && to !== null) return `${String(from)} — ${String(to)}`
  return from !== null ? String(from) : to !== null ? String(to) : ''
}

export const localizeCv = (m: MemberWithCv, lang: CvLang): CvDoc => {
  /*
   * Kontakt se sklapa kao NIZ, ne kao objekat sa fiksnim poljima: prazna stavka se
   * jednostavno ne doda, pa renderer nema nijedno grananje na „ima li telefon".
   */
  const contact: CvDoc['contact'] = []
  if (m.email) contact.push({ label: 'email', value: m.email, link: `mailto:${m.email}` })
  if (m.phone) contact.push({ label: 'phone', value: m.phone, link: `tel:${m.phone}` })

  const location = pick(m.locationSr, m.locationEn, lang)
  if (location) contact.push({ label: 'location', value: location })

  /*
   * Adrese se prikazuju bez sheme („github.com/…"), a link zadržava punu. U CV-u koji se
   * i štampa, `https://` je šum — a u onom koji se klikće mora da radi.
   */
  for (const url of [m.githubUrl, m.linkedinUrl, m.websiteUrl]) {
    if (!url) continue
    contact.push({ label: '', value: url.replace(/^https?:\/\//, ''), link: url })
  }

  return {
    fullName: m.fullName,
    role: pick(m.roleSr, m.roleEn, lang),
    contact,
    summary: pick(m.summarySr, m.summaryEn, lang),

    education: m.hasDiploma
      ? {
          status: pick(m.educationStatusSr, m.educationStatusEn, lang),
          university: pick(m.universitySr, m.universityEn, lang),
          degree: pick(m.degreeSr, m.degreeEn, lang),
          programme: pick(m.programmeSr, m.programmeEn, lang),
          faculty: pick(m.facultySr, m.facultyEn, lang),
          city: m.city,
          gpa: m.gpa,
          years: studyYears(m.educationStartYear, m.educationEndYear),
        }
      : null,

    experiences: m.cvExperiences.map((e) => ({
      company: e.company,
      position: pick(e.positionSr, e.positionEn, lang),
      location: pick(e.locationSr, e.locationEn, lang),
      range: formatRange(e.startYear, e.startMonth, e.endYear, e.endMonth, lang),
      duration: formatDuration(
        monthsBetween(e.startYear, e.startMonth, e.endYear, e.endMonth),
        lang,
      ),
      summary: pick(e.summarySr, e.summaryEn, lang),
      bullets: lang === 'sr' ? e.bulletsSr : e.bulletsEn,
      technologies: e.technologies,
    })),

    /* Projekti dolaze ISKLJUČIVO sa sajta; redosled je onaj iz admina. */
    projects: [
      ...m.cvSiteProjects.map((sp) => ({
        name: pick(sp.project.titleSr, sp.project.titleEn, lang),
        summary: pick(sp.project.descSr, sp.project.descEn, lang),
        bullets: [] as string[],
        technologies: sp.project.technologies.map((pt) => pt.technology.label),
        note: pick(sp.noteSr, sp.noteEn, lang),
        year: sp.project.year,
        links: [sp.project.liveUrl, sp.project.repoUrl].filter((url): url is string =>
          Boolean(url),
        ),
      })),
    ],

    languages: m.cvLanguages.map((l) => ({
      name: pick(l.nameSr, l.nameEn, lang),
      level: pick(l.levelSr, l.levelEn, lang),
    })),

    /*
     * Zbir meseci, ne razlika od prvog do poslednjeg datuma.
     *
     * Razlika bi uračunala i pauze između poslova kao radno iskustvo. Zbir preceni samo ako
     * se dva posla PREKLAPAJU, što je redak slučaj i uvek svestan — a pauze su česte.
     */
    totalExperience:
      m.cvExperiences.length === 0
        ? ''
        : formatDuration(
            m.cvExperiences.reduce(
              (sum, e) => sum + monthsBetween(e.startYear, e.startMonth, e.endYear, e.endMonth),
              0,
            ),
            lang,
          ),
  }
}
