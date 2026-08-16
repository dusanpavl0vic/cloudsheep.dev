import i18next, { type i18n as I18nInstance, type Resource } from 'i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import ICU from 'i18next-icu'
import { initReactI18next } from 'react-i18next'

import { DEFAULT_LOCALE, SUPPORTED_LOCALES } from './languages'

interface CreateI18nOptions {
  /** Početni resursi — globalni namespace-ovi app-e (common, errors) */
  resources: Resource
  /** localStorage ključ pod kojim se pamti izbor jezika */
  storageKey: string
  /** Podrazumevani namespace; ostali se učitavaju lazy uz feature */
  defaultNS?: string
  /** U testovima `cimode` — `t('a.b')` vraća `'a.b'` (docs/12-testing.md) */
  lng?: string
}

/**
 * Pravi i18next instancu.
 *
 * ICU je uključen zbog srpskog: jezik ima **tri** plural forme (`one`/`few`/`other`), a
 * i18next-ov ugrađeni plural sistem ih ne pokriva pouzdano. Bez ICU-a se „3 projekta"
 * renderuje kao „3 projekat" (docs/09-i18n.md).
 */
export function createI18n({
  resources,
  storageKey,
  defaultNS = 'common',
  lng,
}: CreateI18nOptions): I18nInstance {
  const instance = i18next.createInstance()

  void instance
    .use(ICU)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      defaultNS,
      fallbackLng: DEFAULT_LOCALE,
      supportedLngs: [...SUPPORTED_LOCALES],
      // Bez ovoga bi 'sr-RS' pao na fallback umesto na 'sr'
      nonExplicitSupportedLngs: true,
      ...(lng === undefined ? {} : { lng }),
      interpolation: {
        // React već escape-uje — dvostruko escape-ovanje kvari navodnike i crtice
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
        lookupLocalStorage: storageKey,
      },
      returnNull: false,
    })

  syncDocumentLang(instance)

  return instance
}

/**
 * Drži `<html lang>` u koraku sa izabranim jezikom.
 *
 * Bez ovoga atribut ostaje na vrednosti iz `index.html` (`sr`) i kad je sajt prebačen na
 * engleski. Posledice nisu kozmetičke: screen reader tada čita engleski tekst srpskim
 * izgovorom, a pretraživač indeksira stranicu pod pogrešnim jezikom.
 *
 * Lighthouse ovo ne prijavljuje jer meri samo prvo učitavanje, pre nego što je iko dodirnuo
 * prebacivač jezika.
 *
 * Stoji ovde, a ne u app-i: pravilo važi za obe app-e i vezano je za i18next instancu, ne za
 * njihove rute. `typeof document` je zaštita za okruženja bez DOM-a (SSR, čist node test).
 */
function syncDocumentLang(instance: I18nInstance): void {
  if (typeof document === 'undefined') return

  const apply = (lng: string) => {
    document.documentElement.lang = lng
  }

  // `language` je nedefinisan dok se `init` ne razreši, pa i početno postavljanje ide
  // kroz događaj; `initialized` se okine i kad je init već gotov.
  instance.on('initialized', () => {
    apply(instance.language)
  })
  instance.on('languageChanged', apply)
}
