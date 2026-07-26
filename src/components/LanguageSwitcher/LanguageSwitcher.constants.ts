import { LANGUAGES, type Language } from '@/i18n'

type LanguageOption = {
  code: Language
  /** Kratka oznaka u dugmetu (npr. „EN"). */
  label: string
  /** Puno ime u padajućem meniju. */
  name: string
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: LANGUAGES.EN, label: 'EN', name: 'English' },
  { code: LANGUAGES.SR, label: 'SR', name: 'Srpski' },
]
