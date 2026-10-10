/**
 * Admin API: putanje (relativne na `API_BASE_URL`) i RTK Query tagovi. Odvojeno od
 * `api.ts` jer RTK Query koristi samo admin — javne stranice ne smeju da nose ove vrednosti.
 */
export const API_REDUCER_PATH = 'api'

/** `{ type, id: 'LIST' }` — tag liste; pojedinačni zapis je `{ type, id }`. */
export const API_LIST_ID = 'LIST'

export const API_TAGS = {
  SESSION: 'Session',
  PROFILE: 'Profile',
  SOCIAL_LINK: 'SocialLink',
  PROJECT: 'Project',
  TECHNOLOGY: 'Technology',
  TEAM_MEMBER: 'TeamMember',
  CV: 'Cv',
  MESSAGE: 'Message',
  NOTE: 'Note',
  TESTIMONIAL: 'Testimonial',
  SUBSCRIBER: 'Subscriber',
  SLOT: 'Slot',
} as const

export type ApiTag = (typeof API_TAGS)[keyof typeof API_TAGS]

/** Admin i prijava. Sa parametrom — funkcija. */
export const ADMIN_API_ENDPOINTS = {
  AUTH_LOGIN: '/auth/login',
  AUTH_REFRESH: '/auth/refresh',
  AUTH_ME: '/auth/me',
  AUTH_LOGOUT: '/auth/logout',

  ADMIN_PROFILE: '/admin/profile',
  ADMIN_SOCIAL_LINKS: '/admin/social-links',
  ADMIN_SOCIAL_LINKS_ORDER: '/admin/social-links/order',
  ADMIN_SOCIAL_LINK: (id: string) => `/admin/social-links/${id}`,

  ADMIN_PROJECTS: '/admin/projects',
  ADMIN_PROJECTS_ORDER: '/admin/projects/order',
  ADMIN_PROJECT: (id: string) => `/admin/projects/${id}`,
  ADMIN_PROJECT_IMAGES: (id: string) => `/admin/projects/${id}/images`,
  ADMIN_PROJECT_IMAGES_ORDER: (id: string) => `/admin/projects/${id}/images/order`,
  ADMIN_PROJECT_IMAGE: (id: string, imageId: string) => `/admin/projects/${id}/images/${imageId}`,

  ADMIN_TECHNOLOGIES: '/admin/technologies',
  ADMIN_TECHNOLOGIES_ORDER: '/admin/technologies/order',
  ADMIN_TECHNOLOGY: (id: string) => `/admin/technologies/${id}`,

  ADMIN_TEAM: '/admin/team',
  ADMIN_TEAM_ORDER: '/admin/team/order',
  ADMIN_TEAM_MEMBER: (id: string) => `/admin/team/${id}`,
  ADMIN_TEAM_CV: (id: string) => `/admin/team/${id}/cv`,
  ADMIN_TEAM_CV_PDF: (id: string) => `/admin/team/${id}/cv.pdf`,

  ADMIN_MESSAGES: '/admin/messages',
  ADMIN_MESSAGE: (id: string) => `/admin/messages/${id}`,

  ADMIN_UPLOADS: '/admin/uploads',

  ADMIN_NOTES: '/admin/notes',
  ADMIN_NOTE: (id: string) => `/admin/notes/${id}`,

  ADMIN_TESTIMONIALS: '/admin/testimonials',
  ADMIN_TESTIMONIALS_ORDER: '/admin/testimonials/order',
  ADMIN_TESTIMONIAL: (id: string) => `/admin/testimonials/${id}`,

  ADMIN_SUBSCRIBERS: '/admin/newsletter',
  ADMIN_SUBSCRIBERS_EXPORT: '/admin/newsletter/export.csv',
  ADMIN_SUBSCRIBER: (id: string) => `/admin/newsletter/${id}`,

  ADMIN_SLOTS: '/admin/booking/slots',
  ADMIN_SLOTS_GENERATE: '/admin/booking/slots/generate',
  ADMIN_SLOT: (id: string) => `/admin/booking/slots/${id}`,
} as const
