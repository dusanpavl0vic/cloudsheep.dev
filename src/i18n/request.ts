import { cookies } from 'next/headers'
import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { ADMIN_LOCALE_COOKIE } from '@/constants/cookies'
import type { Locale } from '@/constants/i18n'
import { MESSAGES } from '@/constants/i18n/messages'

import { routing } from './routing'

/** Admin nema jezik u URL-u (ADR 0012) — vlasnik studija piše srpski, osim ako ne izabere drugo. */
const ADMIN_DEFAULT_LOCALE: Locale = 'sr'

/**
 * Poruke za serverske komponente; jezik dolazi iz segmenta `[locale]`. Zahtev bez segmenta je
 * admin: jezik iz kolačića `cs-admin-locale` — čita se OVDE, jer Next renderuje layout i
 * stranicu paralelno, pa jezik vezan u admin layout-u ne bi stigao do stranice.
 * `requestLocale` je zastareo u korist `next/root-params` — razlog i okidač: `./locale.ts`.
 */
// eslint-disable-next-line @typescript-eslint/no-deprecated
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const fromCookie = requested ? undefined : (await cookies()).get(ADMIN_LOCALE_COOKIE)?.value
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : hasLocale(routing.locales, fromCookie)
      ? fromCookie
      : requested
        ? routing.defaultLocale
        : ADMIN_DEFAULT_LOCALE

  return { locale, messages: MESSAGES[locale], timeZone: 'Europe/Belgrade' }
})
