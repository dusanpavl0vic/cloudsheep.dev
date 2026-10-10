import { ROUTES } from './routes'

/** Meni admin-a. Odvojeno od `navigation.ts`, koji je u JS-u javnih stranica (ADR 0014). */
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
