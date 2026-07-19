import i18n from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import { initReactI18next } from 'react-i18next'

import { STORAGE_KEYS } from '@/constants/storageKeys'

import en from './locales/en.json'
import sr from './locales/sr.json'

export const LANGUAGES = {
  SR: 'sr',
  EN: 'en',
} as const

export type Language = (typeof LANGUAGES)[keyof typeof LANGUAGES]

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sr: { translation: sr },
    },
    fallbackLng: LANGUAGES.SR,
    supportedLngs: Object.values(LANGUAGES),
    interpolation: { escapeValue: false },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: STORAGE_KEYS.LANGUAGE,
    },
  })

export default i18n
