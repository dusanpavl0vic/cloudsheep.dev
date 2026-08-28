/**
 * Putanje su na engleskom, kao i ostatak koda.
 *
 * Ranije su bile na srpskom (`/prijava`, `/projekti`) — panel je interni, pa je jezik URL-a
 * bio pitanje ukusa. Sa pet ruta i query parametrima (`?edit=`, `?lang=`) mešanje jezika
 * postaje šum: ime rute u kodu je `PROJECT_EDIT`, a u adresi je stajalo `izmena`.
 * Interfejs je i dalje dvojezičan — to je stvar prevoda, ne adrese.
 */
export const ROUTES = {
  DASHBOARD: '/',
  LOGIN: '/login',
  PROJECTS: '/projects',
  PROJECT_NEW: '/projects/new',
  PROJECT_EDIT: '/projects/:id',
  TECHNOLOGIES: '/technologies',
  PROFILE: '/profile',
  TEAM: '/team',
  TEAM_CV: '/team/:id/cv',
  MESSAGES: '/messages',
  NOT_FOUND: '*',
} as const

export const projectEditPath = (id: string) => `/projects/${id}`

/** Nazivi query parametara — na jednom mestu, da se `?edit=` ne piše rukom po stranicama. */
export const QUERY = {
  /** id zapisa koji se uređuje */
  EDIT: 'edit',
  /** prisustvo znači „otvori praznu formu" */
  NEW: 'new',
  /** aktivan jezik u dvojezičnoj formi */
  LANG: 'lang',
} as const
