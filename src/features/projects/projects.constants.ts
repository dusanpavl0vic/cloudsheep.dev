/**
 * Portfolio projekti kao podaci — dele ih landing (izabrani radovi),
 * Projects stranica (mreža + filter) i Project stranica (studija slučaja).
 * Tekst ide preko i18n ključeva (`projects.items.<key>.*`); tehnologije su nazivi alata.
 */

export const PROJECT_CATEGORIES = ['all', 'frontend', 'backend', 'fullStack', 'openSource'] as const

export type ProjectCategory = (typeof PROJECT_CATEGORIES)[number]

export type Project = {
  slug: string
  /** i18n namespace segment (bez crtica). */
  key: string
  year: string
  category: Exclude<ProjectCategory, 'all'>
  tech: readonly string[]
  /** Ima li punu studiju slučaja. */
  hasCaseStudy?: boolean
}

export const PROJECTS: readonly Project[] = [
  {
    slug: 'atlas-analytics',
    key: 'atlas',
    year: '2025',
    category: 'fullStack',
    tech: ['Next.js', 'TypeScript', 'PostgreSQL'],
    hasCaseStudy: true,
  },
  {
    slug: 'nis-transit',
    key: 'transit',
    year: '2024',
    category: 'frontend',
    tech: ['React Native', 'Node.js', 'GTFS'],
  },
  {
    slug: 'forge-cms',
    key: 'forge',
    year: '2024',
    category: 'openSource',
    tech: ['React', 'MongoDB', 'Docker'],
  },
  {
    slug: 'pulse-api',
    key: 'pulse',
    year: '2023',
    category: 'backend',
    tech: ['Node.js', 'PostgreSQL', 'Docker'],
  },
  {
    slug: 'meridian',
    key: 'meridian',
    year: '2023',
    category: 'fullStack',
    tech: ['Next.js', 'Stripe', 'PostgreSQL'],
  },
] as const

/** Prva tri projekta — izabrani radovi na landing stranici. */
export const FEATURED_PROJECTS = PROJECTS.slice(0, 3)

export const getProjectBySlug = (slug: string) => PROJECTS.find((p) => p.slug === slug)

/** Sadržaj studije slučaja (Atlas Analytics) — sekcije se renderuju kroz .map(). */
export const CASE_STUDY_HIGHLIGHTS = [
  'caseStudy.highlight1',
  'caseStudy.highlight2',
  'caseStudy.highlight3',
  'caseStudy.highlight4',
] as const

export const CASE_STUDY_STATS = [
  { id: 'events', valueKey: 'caseStudy.stat1Value', labelKey: 'caseStudy.stat1Label' },
  { id: 'query', valueKey: 'caseStudy.stat2Value', labelKey: 'caseStudy.stat2Label' },
  { id: 'weeks', valueKey: 'caseStudy.stat3Value', labelKey: 'caseStudy.stat3Label' },
] as const

export const CASE_STUDY_SECTIONS = [
  { id: 'problem', titleKey: 'caseStudy.problemTitle', bodyKeys: ['caseStudy.problem1', 'caseStudy.problem2'] },
  { id: 'decisions', titleKey: 'caseStudy.decisionsTitle', bodyKeys: ['caseStudy.decisions1', 'caseStudy.decisions2'] },
  { id: 'outcome', titleKey: 'caseStudy.outcomeTitle', bodyKeys: ['caseStudy.outcome1'] },
] as const
