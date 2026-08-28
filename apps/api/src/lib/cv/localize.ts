import type { MemberWithCv } from '../serialize.ts'
import { formatDuration, formatRange, monthsBetween, type CvLang } from './labels.ts'

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

  skillGroups: { group: string; items: { name: string; years: number | null }[] }[]
  languages: { name: string; level: string }[]
}

const pick = (sr: string, en: string, lang: CvLang) => (lang === 'sr' ? sr : en)

/** Godine studija: „2020 — 2025", ili samo jedna, ili ništa. */
const studyYears = (from: number | null, to: number | null): string => {
  if (from !== null && to !== null) return `${String(from)} — ${String(to)}`
  return from !== null ? String(from) : to !== null ? String(to) : ''
}

/**
 * Veštine grupisane po nazivu grupe, uz čuvanje redosleda unosa.
 *
 * Stavke bez grupe idu u jednu bezimenu grupu NA KRAJU — tako se ne meša sa imenovanim
 * grupama i ne traži poseban prolaz u rendereru.
 */
const groupSkills = (
  skills: { name: string; groupSr: string; groupEn: string; years: number | null }[],
  lang: CvLang,
): CvDoc['skillGroups'] => {
  const order: string[] = []
  const byGroup = new Map<string, { name: string; years: number | null }[]>()

  for (const skill of skills) {
    const group = pick(skill.groupSr, skill.groupEn, lang)
    if (!byGroup.has(group)) {
      byGroup.set(group, [])
      order.push(group)
    }
    byGroup.get(group)?.push({ name: skill.name, years: skill.years })
  }

  return order
    .sort((a, b) => (a === '' ? 1 : b === '' ? -1 : 0))
    .map((group) => ({ group, items: byGroup.get(group) ?? [] }))
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

    projects: m.cvProjects.map((p) => ({
      name: p.name,
      summary: pick(p.summarySr, p.summaryEn, lang),
      bullets: lang === 'sr' ? p.bulletsSr : p.bulletsEn,
      technologies: p.technologies,
      note: pick(p.noteSr, p.noteEn, lang),
      year: p.year,
      links: [p.liveUrl, p.repoUrl].filter(Boolean),
    })),

    skillGroups: groupSkills(
      m.cvSkills.map((s) => ({
        name: s.name,
        groupSr: s.groupSr,
        groupEn: s.groupEn,
        years: s.years === null ? null : Number(s.years),
      })),
      lang,
    ),

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
