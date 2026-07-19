import { LANGUAGES, type Language } from '@/i18n'

type LanguageOption = {
  code: Language
  label: string
}

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { code: LANGUAGES.SR, label: 'SR' },
  { code: LANGUAGES.EN, label: 'EN' },
]
