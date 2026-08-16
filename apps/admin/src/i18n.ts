
import authEn from '@/features/auth/locales/en.json'
import authSr from '@/features/auth/locales/sr.json'
import { STORAGE_KEYS } from '@/lib/storageKeys'
import commonEn from '@/locales/en.json'
import commonSr from '@/locales/sr.json'
import { createI18n } from '@app/i18n'

/**
 * Admin ima samo dva namespace-a, pa se oba učitavaju odmah — lazy podela ovde
 * ne bi donela ništa, a `auth` treba pre prve rute (docs/09-i18n.md).
 */
export const i18n = createI18n({
  resources: {
    sr: { common: commonSr, auth: authSr },
    en: { common: commonEn, auth: authEn },
  },
  storageKey: STORAGE_KEYS.LANGUAGE,
  defaultNS: 'common',
})
