/**
 * Registry jezika — **jedini** izvor istine o tome koji jezici postoje.
 *
 * Dodavanje jezika je izmena ovog niza plus prevodi. Ništa drugo u kodu ne sme da
 * nabraja jezike; ako negde vidiš `if (lang === 'sr')`, to je greška (docs/09-i18n.md).
 */
export interface LanguageDefinition {
  /** ISO kod, koristi se kao i18next `lng` i kao `<html lang>` */
  code: string
  /** Ime jezika na tom jeziku — nikad prevedeno */
  label: string
  /** Kratka oznaka za prekidač jezika */
  short: string
  /** Smer pisanja; postavlja se na `<html dir>` */
  dir: 'ltr' | 'rtl'
  /** BCP 47 lokal za `Intl.*` — nije uvek isto što i `code` */
  intlLocale: string
}

export const LANGUAGES = [
  {
    code: 'sr',
    label: 'Srpski',
    short: 'SR',
    dir: 'ltr',
    // Latinica eksplicitno — bez `-Latn` Intl bira ćirilicu za sr
    intlLocale: 'sr-Latn-RS',
  },
  {
    code: 'en',
    label: 'English',
    short: 'EN',
    dir: 'ltr',
    intlLocale: 'en-GB',
  },
] as const satisfies readonly LanguageDefinition[]

export type Locale = (typeof LANGUAGES)[number]['code']

export const DEFAULT_LOCALE: Locale = 'sr'

export const SUPPORTED_LOCALES: readonly Locale[] = LANGUAGES.map((language) => language.code)

/** Definicija za dati kod; pada na podrazumevani jezik za nepoznat kod. */
export function getLanguage(code: string): LanguageDefinition {
  return (
    LANGUAGES.find((language) => language.code === code) ??
    LANGUAGES.find((language) => language.code === DEFAULT_LOCALE) ??
    LANGUAGES[0]
  )
}

/** Da li je kod jedan od podržanih jezika. */
export function isSupportedLocale(code: string): code is Locale {
  return SUPPORTED_LOCALES.some((locale) => locale === code)
}
