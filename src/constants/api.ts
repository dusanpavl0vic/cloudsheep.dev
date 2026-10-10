/** Isto poreklo — API je deo aplikacije (ADR 0009), bez CORS-a. */
export const API_BASE_URL = '/api'

/**
 * Putanje javnih API ruta, relativne na `API_BASE_URL`. Admin putanje i RTK Query tagovi su u
 * `adminApi.ts`: ovaj modul je u JS-u javnih stranica, pa ne sme da nosi ništa što koristi
 * samo admin (ADR 0014).
 */
export const API_ENDPOINTS = {
  CONTACT: '/contact',
  CONTACT_CONFIRM: '/contact/confirm',
  NEWSLETTER_CONFIRM: '/newsletter/confirm',
  EMAIL_CHECK: '/email/check',
  NEWSLETTER: '/newsletter',
  BOOKING_SLOTS: '/booking/slots',
} as const
