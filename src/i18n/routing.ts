import { defineRouting } from 'next-intl/routing'

import { DEFAULT_LOCALE, LOCALES } from '@/constants/i18n'

/**
 * Engleski na `/`, srpski na `/sr/…` (ADR 0012).
 *
 * `localeDetection: false` — ista adresa uvek daje isti jezik. Preusmeravanje po
 * `Accept-Language` bi Googlebotu i kešu davalo različit sadržaj na istoj adresi.
 */
export const routing = defineRouting({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'as-needed',
  localeDetection: false,
  // hreflang ide u `<head>` i sitemap (docs/05-routing.md §5); `Link` zaglavlje bi bilo treći izvor.
  alternateLinks: false,
})
