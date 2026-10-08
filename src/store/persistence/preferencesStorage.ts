import { ADMIN_LOCALE_STORAGE_KEY, THEME_COOKIE, THEME_COOKIE_MAX_AGE_S } from '@/constants/cookies'
import { isLocale, type Locale } from '@/constants/i18n'
import type { ThemeMode } from '@/constants/preferences'

/**
 * Tema ide u KOLAČIĆ, ne u localStorage: server ga čita pri renderu i odmah postavlja
 * `data-theme`, pa nema treptaja (docs/08-styling-ui.md §3). Svaki pristup je u try/catch —
 * kolačići i storage umeju da budu blokirani.
 */
export const saveThemeCookie = (mode: ThemeMode) => {
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${THEME_COOKIE}=${mode}; Path=/; Max-Age=${String(THEME_COOKIE_MAX_AGE_S)}; SameSite=Lax${secure}`
  } catch {
    // tema i dalje važi do sledećeg učitavanja
  }
}

/** Menja temu bez rerendera — tokeni su CSS promenljive vezane za `data-theme`. */
export const applyThemeAttribute = (mode: ThemeMode) => {
  try {
    document.documentElement.dataset.theme = mode
  } catch {
    // van pregledača (test) nema dokumenta
  }
}

export const loadAdminLocale = (): Locale | null => {
  try {
    const value = window.localStorage.getItem(ADMIN_LOCALE_STORAGE_KEY)
    return isLocale(value) ? value : null
  } catch {
    return null
  }
}

export const saveAdminLocale = (locale: Locale) => {
  try {
    window.localStorage.setItem(ADMIN_LOCALE_STORAGE_KEY, locale)
  } catch {
    // jezik važi do osvežavanja
  }
}
