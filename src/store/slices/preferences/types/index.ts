import type { ThemeMode } from '@/constants/preferences'

export interface PreferencesState {
  /** `null` — korisnik nije birao, tema prati sistem (`prefers-color-scheme`). */
  theme: ThemeMode | null
}
