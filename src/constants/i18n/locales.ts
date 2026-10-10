/**
 * Jezici javnog sajta. Odvojeno od poruka: komponenta koja samo prikazuje izbor jezika ne sme
 * da povuče sve prevode u svoj bundle (docs/09-i18n.md §1).
 */
export const LOCALES = ['en', 'sr'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'en'

export const LOCALE_LABELS: Record<Locale, string> = { en: 'EN', sr: 'SR' }

/** `lang` atribut i `hreflang` — srpski je latinica. */
export const LOCALE_TAGS: Record<Locale, string> = { en: 'en', sr: 'sr-Latn' }

/** `og:locale` traži region. */
export const OG_LOCALES: Record<Locale, string> = { en: 'en_US', sr: 'sr_RS' }

/** `Intl` formati datuma i brojeva. */
export const INTL_LOCALES: Record<Locale, string> = { en: 'en-GB', sr: 'sr-Latn-RS' }

export const isLocale = (value: unknown): value is Locale => LOCALES.includes(value as Locale)
