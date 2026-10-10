import { ADMIN_LOCALE_COOKIE, THEME_COOKIE, THEME_COOKIE_MAX_AGE_S } from '@/constants/cookies'
import type { Locale } from '@/constants/i18n'
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

/** Jezik admin-a ide u kolačić; posle upisa `router.refresh()` renderuje admin na novom jeziku. */
export const saveAdminLocaleCookie = (locale: Locale) => {
  try {
    const secure = window.location.protocol === 'https:' ? '; Secure' : ''
    document.cookie = `${ADMIN_LOCALE_COOKIE}=${locale}; Path=/; Max-Age=${String(THEME_COOKIE_MAX_AGE_S)}; SameSite=Lax${secure}`
  } catch {
    // jezik se ne pamti, ali promena i dalje važi do sledećeg učitavanja
  }
}
