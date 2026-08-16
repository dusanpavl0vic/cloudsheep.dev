
import { STORAGE_KEYS } from '@/lib/storageKeys'
import commonEn from '@/locales/en.json'
import commonSr from '@/locales/sr.json'
import { createI18n, DEFAULT_LOCALE, LANGUAGES } from '@app/i18n'

/**
 * i18next instanca za `apps/web`.
 *
 * Samo `common` se učitava odmah — on nosi navigaciju, footer i temu, dakle ono što je
 * na ekranu pre nego što se ijedna ruta razreši. Namespace feature-a stiže sa njegovim
 * chunk-om kroz `loadFeatureNamespace` (docs/09-i18n.md).
 */
export const i18n = createI18n({
  resources: {
    sr: { common: commonSr },
    en: { common: commonEn },
  },
  storageKey: STORAGE_KEYS.LANGUAGE,
  defaultNS: 'common',
})

/** Namespace-ovi koji se učitavaju lazy, uz chunk svog feature-a. */
const FEATURE_LOADERS = {
  landing: {
    sr: () => import('@/features/landing/locales/sr.json'),
    en: () => import('@/features/landing/locales/en.json'),
  },
  projects: {
    sr: () => import('@/features/projects/locales/sr.json'),
    en: () => import('@/features/projects/locales/en.json'),
  },
  contact: {
    sr: () => import('@/features/contact/locales/sr.json'),
    en: () => import('@/features/contact/locales/en.json'),
  },
  uses: {
    sr: () => import('@/features/uses/locales/sr.json'),
    en: () => import('@/features/uses/locales/en.json'),
  },
} as const

export type FeatureNamespace = keyof typeof FEATURE_LOADERS

/**
 * Učitava prevode jednog feature-a za sve jezike i registruje ih.
 *
 * Poziva se iz `lazy()` rute pre nego što se komponenta renderuje — tako prevodi
 * putuju sa chunk-om feature-a, a landing stranica ne skida rečnik case study-ja.
 */
export async function loadFeatureNamespace(namespace: FeatureNamespace): Promise<void> {
  if (i18n.hasResourceBundle(DEFAULT_LOCALE, namespace)) return

  const loaders = FEATURE_LOADERS[namespace]

  await Promise.all(
    LANGUAGES.map(async ({ code }) => {
      const locale = code
      const module = await loaders[locale]()
      i18n.addResourceBundle(locale, namespace, module.default, true, true)
    }),
  )

  await i18n.loadNamespaces(namespace)
}
