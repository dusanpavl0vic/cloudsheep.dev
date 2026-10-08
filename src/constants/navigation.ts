import { HOME_SECTIONS, ROUTES, type HomeSection } from './routes'

/** Ključ stavke = ključ prevoda u `nav.*`. */
export type NavKey = 'studio' | 'services' | 'process' | 'work' | 'stack' | 'pricing' | 'faq' | 'notes'

export interface NavItem {
  key: NavKey
  /** Sekcija početne (sidro) ili stranica. */
  section?: HomeSection
  href?: string
}

/** Glavna navigacija iz dizajna: sedam sekcija početne + beleške. */
export const MAIN_NAV_ITEMS: readonly NavItem[] = [
  { key: 'studio', section: HOME_SECTIONS.STUDIO },
  { key: 'services', section: HOME_SECTIONS.SERVICES },
  { key: 'process', section: HOME_SECTIONS.PROCESS },
  { key: 'work', section: HOME_SECTIONS.WORK },
  { key: 'stack', section: HOME_SECTIONS.STACK },
  { key: 'pricing', section: HOME_SECTIONS.PRICING },
  { key: 'faq', section: HOME_SECTIONS.FAQ },
  { key: 'notes', href: ROUTES.NOTES },
]

/** Sekcije čije se prisustvo prati za aktivnu stavku navigacije (redom odozgo). */
export const TRACKED_SECTIONS: readonly HomeSection[] = MAIN_NAV_ITEMS.flatMap((item) => (item.section ? [item.section] : []))

/** Koliko piksela od vrha sekcija postaje „trenutna" (ispod plutajućeg headera). */
export const ACTIVE_SECTION_OFFSET = 160

/** Gradovi klijenata u podnožju (dizajn: „Clients in"). */
export const CLIENT_CITIES = ['Niš', 'Beograd', 'Berlin', 'Amsterdam', 'London', 'New York', 'Remote'] as const

export const ADMIN_NAV_ITEMS = [
  { key: 'dashboard', href: ROUTES.ADMIN },
  { key: 'messages', href: ROUTES.ADMIN_MESSAGES },
  { key: 'booking', href: ROUTES.ADMIN_BOOKING },
  { key: 'projects', href: ROUTES.ADMIN_PROJECTS },
  { key: 'notes', href: ROUTES.ADMIN_NOTES },
  { key: 'testimonials', href: ROUTES.ADMIN_TESTIMONIALS },
  { key: 'technologies', href: ROUTES.ADMIN_TECHNOLOGIES },
  { key: 'team', href: ROUTES.ADMIN_TEAM },
  { key: 'newsletter', href: ROUTES.ADMIN_NEWSLETTER },
  { key: 'profile', href: ROUTES.ADMIN_PROFILE },
] as const

export type AdminNavKey = (typeof ADMIN_NAV_ITEMS)[number]['key']
