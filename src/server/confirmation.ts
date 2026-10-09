import 'server-only'

import { createHash, randomBytes } from 'node:crypto'

import { CONFIRM_LINK_HOURS, UNCONFIRMED_PURGE_DAYS } from '@/constants/confirmation'
import { SITE_URL } from '@/constants/env'
import type { Locale } from '@/constants/i18n'
import { localizedPath } from '@/helpers/seo'

const HOUR = 3_600_000

/** Token za link iz mejla: 32 slučajna bajta; u bazi samo SHA-256 (kao refresh token). */
export const createConfirmToken = () => {
  const token = randomBytes(32).toString('base64url')
  return { token, hash: hashConfirmToken(token) }
}

export const hashConfirmToken = (token: string) => createHash('sha256').update(token).digest('hex')

/** Zahtev kreiran pre ovog trenutka više ne može da se potvrdi (i ne drži termin). */
export const linkCutoff = (now = new Date()) => new Date(now.getTime() - CONFIRM_LINK_HOURS * HOUR)

/** Nepotvrđeno starije od ovoga se briše. */
export const purgeCutoff = (now = new Date()) => new Date(now.getTime() - UNCONFIRMED_PURGE_DAYS * 24 * HOUR)

/** Apsolutan link na stranicu potvrde, na jeziku forme. */
export const confirmLink = (route: string, locale: Locale, token: string) =>
  `${SITE_URL}${localizedPath(route, locale)}?token=${encodeURIComponent(token)}`
