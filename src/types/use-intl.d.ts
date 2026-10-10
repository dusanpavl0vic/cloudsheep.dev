import type { Locale, Messages } from '@/constants/i18n'

/**
 * Tipizovani ključevi u `t('...')`. Šablon augmentuje `use-intl`; next-intl je isti API i
 * čita konfiguraciju iz svog modula (ADR 0012).
 */
declare module 'next-intl' {
  interface AppConfig {
    Locale: Locale
    Messages: Messages
  }
}
