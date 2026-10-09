/** Izabrana tema. Server je čita da bi odmah renderovao tačnu (docs/08-styling-ui.md §3). */
export const THEME_COOKIE = 'cs-theme'
export const THEME_COOKIE_MAX_AGE_S = 60 * 60 * 24 * 365

/** Refresh token admin sesije — httpOnly, samo na `/api/auth` (docs/20-security.md). */
export const REFRESH_COOKIE = 'refresh_token'
export const REFRESH_COOKIE_PATH = '/api/auth'

/**
 * Jezik admin panela (admin nema jezik u URL-u — ADR 0012). Kolačić, ne localStorage: server ga
 * čita i odmah renderuje tačan jezik, kao kod teme.
 */
export const ADMIN_LOCALE_COOKIE = 'cs-admin-locale'
