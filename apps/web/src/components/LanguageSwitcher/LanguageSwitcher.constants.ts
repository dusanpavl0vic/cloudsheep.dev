import { LANGUAGES, type Locale } from '@app/i18n'

/**
 * Opcije prekidača se izvode iz registra jezika u `@app/i18n` — dodavanje jezika
 * je izmena jednog niza tamo, ne i ovde (docs/09-i18n.md).
 */
export interface LanguageOption {
  code: Locale
  /** Kratka oznaka u dugmetu (npr. „EN"). */
  label: string
  /** Puno ime u padajućem meniju. */
  name: string
}

export const LANGUAGE_OPTIONS: LanguageOption[] = LANGUAGES.map((language) => ({
  code: language.code,
  label: language.short,
  name: language.label,
}))

/**
 * Podrazumevana opcija je izdvojena kao imenovana konstanta, ne kao `LANGUAGE_OPTIONS[0]` —
 * uz `noUncheckedIndexedAccess` indeksiranje daje `| undefined`.
 */
export const DEFAULT_LANGUAGE_OPTION: LanguageOption = {
  code: LANGUAGES[0].code,
  label: LANGUAGES[0].short,
  name: LANGUAGES[0].label,
}
