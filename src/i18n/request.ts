import { hasLocale } from 'next-intl'
import { getRequestConfig } from 'next-intl/server'

import { MESSAGES } from '@/constants/i18n/messages'

import { routing } from './routing'

/**
 * Poruke za serverske komponente; jezik dolazi iz segmenta `[locale]`.
 * `requestLocale` je zastareo u korist `next/root-params` — razlog i okidač: `./locale.ts`.
 */
// eslint-disable-next-line @typescript-eslint/no-deprecated
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale

  return { locale, messages: MESSAGES[locale], timeZone: 'Europe/Belgrade' }
})
