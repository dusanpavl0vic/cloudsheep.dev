import { LANGUAGES, type Language } from '@/i18n'

interface LanguageOption {
  code: Language
  /** Kratka oznaka u dugmetu (npr. „EN"). */
  label: string
  /** Puno ime u padajućem meniju. */
  name: string
}

/**
 * Podrazumevana opcija je izdvojena kao imenovana konstanta, ne kao `LANGUAGE_OPTIONS[0]` —
 * uz `noUncheckedIndexedAccess` indeksiranje daje `| undefined`, a fallback jezik je
 * previše bitan da bi zavisio od pozicije u nizu.
 */
export const DEFAULT_LANGUAGE_OPTION: LanguageOption = {
  code: LANGUAGES.EN,
  label: 'EN',
  name: 'English',
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  DEFAULT_LANGUAGE_OPTION,
  { code: LANGUAGES.SR, label: 'SR', name: 'Srpski' },
]
