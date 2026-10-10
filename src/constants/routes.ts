/**
 * Sve putanje aplikacije, bez jezičkog prefiksa — `Link` iz `@/i18n/navigation` ga dodaje
 * sam (`/projects` → `/sr/projects`). Šabloni koriste `:param`; konkretne linkove prave
 * builderi ispod. U komponenti se nikad ne piše `` `/projects/${slug}` `` (docs/05-routing.md).
 */
export const ROUTES = {
  HOME: '/',
  PROJECTS: '/projects',
  PROJECT: '/projects/:slug',
  NOTES: '/notes',
  NOTE: '/notes/:slug',
  CONTACT: '/contact',
  CONTACT_CONFIRM: '/contact/confirm',
  NEWSLETTER_CONFIRM: '/newsletter/confirm',

  ADMIN: '/admin',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_MESSAGES: '/admin/messages',
  ADMIN_PROFILE: '/admin/profile',
  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_PROJECT_NEW: '/admin/projects/new',
  ADMIN_PROJECT: '/admin/projects/:projectId',
  ADMIN_TEAM: '/admin/team',
  ADMIN_TEAM_CV: '/admin/team/:memberId/cv',
  ADMIN_TECHNOLOGIES: '/admin/technologies',
  ADMIN_NOTES: '/admin/notes',
  ADMIN_NOTE_NEW: '/admin/notes/new',
  ADMIN_NOTE: '/admin/notes/:noteId',
  ADMIN_TESTIMONIALS: '/admin/testimonials',
  ADMIN_NEWSLETTER: '/admin/newsletter',
  ADMIN_BOOKING: '/admin/booking',

  NOT_FOUND: '*',
} as const

export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES]

/** Popunjava `:param` u šablonu. Vrednost se enkoduje — slug iz baze nije poverljiv ulaz. */
const fillPath = (template: string, params: Record<string, string>) =>
  template.replace(/:(\w+)/g, (_, name: string) => encodeURIComponent(params[name] ?? ''))

/** Dodaje query, preskačući prazne vrednosti. */
const withQuery = (path: string, query: Record<string, string | undefined>) => {
  const search = new URLSearchParams(
    Object.entries(query).filter((entry): entry is [string, string] => Boolean(entry[1])),
  ).toString()
  return search ? `${path}?${search}` : path
}

/** Sekcije početne strane — `id` u HTML-u i sidro u linku. */
export const HOME_SECTIONS = {
  INSIGHT: 'insight',
  STUDIO: 'studio',
  SERVICES: 'services',
  PROCESS: 'process',
  WORK: 'work',
  TESTIMONIALS: 'testimonials',
  STACK: 'stack',
  PRICING: 'pricing',
  ESTIMATOR: 'estimate',
  FAQ: 'faq',
} as const

export type HomeSection = (typeof HOME_SECTIONS)[keyof typeof HOME_SECTIONS]

/** /#pricing */
export const homeSectionHref = (section: HomeSection) => `${ROUTES.HOME}#${section}`

/** /projects/booksphere */
export const projectHref = (slug: string) => fillPath(ROUTES.PROJECT, { slug })

/** /projects?category=mobile — filter je u URL-u, ne u Redux-u. */
export const projectsHref = (category?: string) => withQuery(ROUTES.PROJECTS, { category })

/** /notes/kako-procenjujemo */
export const noteHref = (slug: string) => fillPath(ROUTES.NOTE, { slug })

/** Podaci kojima procena ili cenovni paket popunjavaju upit. */
export interface ContactPrefill {
  type?: string
  budget?: string
  timeline?: string
  plan?: string
  /** Procena: liste su spojene zarezom (`web,ios`). */
  platforms?: string
  features?: string
  pace?: string
}

/** /contact?type=webapp&budget=… */
export const contactHref = (prefill: ContactPrefill = {}) =>
  withQuery(ROUTES.CONTACT, { ...prefill })

export const adminProjectHref = (projectId: string) => fillPath(ROUTES.ADMIN_PROJECT, { projectId })
export const adminNoteHref = (noteId: string) => fillPath(ROUTES.ADMIN_NOTE, { noteId })
export const adminTeamCvHref = (memberId: string) => fillPath(ROUTES.ADMIN_TEAM_CV, { memberId })
