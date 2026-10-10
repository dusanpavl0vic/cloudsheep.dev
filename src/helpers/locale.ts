import type { Locale } from '@/constants/i18n'

/**
 * Vrednost dvojezičnog polja za jezik stranice. Prazan prevod pada na drugi jezik — stranica
 * bez naslova je gora od naslova na pogrešnom jeziku.
 */
export const pickLocalized = (locale: Locale, sr: string, en: string) => {
  const [preferred, fallback] = locale === 'sr' ? [sr, en] : [en, sr]
  return preferred === '' ? fallback : preferred
}
