import { ROUTES, projectPath } from './routes'

/** Sidro-sekcije na landing stranici — koriste ih i header i footer. */
export const SECTION_IDS = {
  TOP: 'top',
  STUDIO: 'studio',
  SERVICES: 'services',
  PROCESS: 'process',
  WORK: 'work',
  PRICING: 'pricing',
  FAQ: 'faq',
  CONTACT: 'contact',
} as const

/** Sidro na landing sekciju iz bilo koje rute (RR skroluje preko useScrollToHash). */
const landingHash = (id: string) => `${ROUTES.HOME}#${id}`

/** Istaknuta studija slučaja (koristi je footer). */
export const FEATURED_PROJECT_SLUG = 'atlas-analytics'

export const MAIN_NAV = [
  { id: 'work', labelKey: 'nav.work', to: ROUTES.PROJECTS, route: true },
  { id: 'services', labelKey: 'nav.services', to: landingHash(SECTION_IDS.SERVICES), route: false },
  { id: 'process', labelKey: 'nav.process', to: landingHash(SECTION_IDS.PROCESS), route: false },
  { id: 'contact', labelKey: 'nav.contact', to: ROUTES.CONTACT, route: true },
] as const

export const FOOTER_NAV = [
  {
    titleKey: 'footer.groupSite',
    links: [
      { id: 'home', labelKey: 'nav.home', to: ROUTES.HOME },
      { id: 'work', labelKey: 'nav.work', to: ROUTES.PROJECTS },
      { id: 'uses', labelKey: 'nav.uses', to: ROUTES.USES },
      { id: 'contact', labelKey: 'nav.contact', to: ROUTES.CONTACT },
    ],
  },
  {
    titleKey: 'footer.groupStudio',
    links: [
      { id: 'services', labelKey: 'nav.services', to: landingHash(SECTION_IDS.SERVICES) },
      { id: 'pricing', labelKey: 'nav.pricing', to: landingHash(SECTION_IDS.PRICING) },
      { id: 'case', labelKey: 'nav.caseStudy', to: projectPath(FEATURED_PROJECT_SLUG) },
      { id: 'faq', labelKey: 'nav.faq', to: landingHash(SECTION_IDS.FAQ) },
    ],
  },
] as const

export const CONTACT_EMAIL = 'hi@cloudsheep.dev'

export const SOCIAL_LINKS = [
  { id: 'github', href: 'https://github.com/cloudsheep', labelKey: 'footer.github' },
  { id: 'linkedin', href: 'https://linkedin.com/in/cloudsheep', labelKey: 'footer.linkedin' },
  { id: 'email', href: `mailto:${CONTACT_EMAIL}`, labelKey: 'footer.email' },
] as const
