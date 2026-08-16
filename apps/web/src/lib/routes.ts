export const ROUTES = {
  HOME: '/',
  PROJECTS: '/projects',
  PROJECT: '/projects/:slug',
  CONTACT: '/contact',
  USES: '/uses',
  NOT_FOUND: '*',
} as const

/** Putanja ka pojedinačnoj studiji slučaja. */
export const projectPath = (slug: string) => `/projects/${slug}`
