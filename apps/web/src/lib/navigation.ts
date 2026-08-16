import { ROUTES, projectPath } from './routes'

/** Sidro-sekcije na landing stranici — koriste ih i header i footer. */
export const SECTION_IDS = {
  TOP: 'top',
  STUDIO: 'studio',
  SERVICES: 'services',
  PROCESS: 'process',
  WORK: 'work',
  STACK: 'stack',
  PRICING: 'pricing',
  FAQ: 'faq',
  CONTACT: 'contact',
} as const

/** Sidro na landing sekciju iz bilo koje rute (RR skroluje preko useScrollToHash). */
const landingHash = (id: string) => `${ROUTES.HOME}#${id}`

/** Istaknuta studija slučaja (koristi je footer). */
export const FEATURED_PROJECT_SLUG = 'atlas-analytics'

/**
 * Glavna navigacija.
 *
 * Početna NIJE stavka — logo levo već vodi na nju, a duplirani link uvek izgleda aktivno
 * na svakoj ruti jer "/" odgovara svakoj putanji.
 *
 * `sectionId` postoji da bi sidro moglo da bude aktivno kad je ta sekcija na ekranu
 * (vidi `useActiveSection`); rute nemaju sekciju i koriste `NavLink` aktivno stanje.
 */
export const MAIN_NAV = [
  { id: 'services', labelKey: 'nav.services', to: landingHash(SECTION_IDS.SERVICES), route: false, sectionId: SECTION_IDS.SERVICES },
  { id: 'process', labelKey: 'nav.process', to: landingHash(SECTION_IDS.PROCESS), route: false, sectionId: SECTION_IDS.PROCESS },
  { id: 'work', labelKey: 'nav.work', to: ROUTES.PROJECTS, route: true, sectionId: null },
  { id: 'pricing', labelKey: 'nav.pricing', to: landingHash(SECTION_IDS.PRICING), route: false, sectionId: SECTION_IDS.PRICING },
  { id: 'contact', labelKey: 'nav.contact', to: ROUTES.CONTACT, route: true, sectionId: null },
] as const

/** Sekcije koje navigacija prati radi aktivnog stanja — redosled prati redosled u dokumentu. */
export const TRACKED_SECTION_IDS = [
  SECTION_IDS.STUDIO,
  SECTION_IDS.SERVICES,
  SECTION_IDS.PROCESS,
  SECTION_IDS.WORK,
  SECTION_IDS.STACK,
  SECTION_IDS.PRICING,
  SECTION_IDS.FAQ,
  SECTION_IDS.CONTACT,
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
