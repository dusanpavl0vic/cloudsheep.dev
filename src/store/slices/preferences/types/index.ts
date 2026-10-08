import type { Locale } from '@/constants/i18n'
import type { ThemeMode } from '@/constants/preferences'

export interface PreferencesState {
  /** `null` — korisnik nije birao, tema prati sistem (`prefers-color-scheme`). */
  theme: ThemeMode | null
  /** Jezik admin panela. Javni sajt ima jezik u URL-u (ADR 0012). */
  adminLocale: Locale
}
