/** RFC 5321: adresa ima najviše 254 znaka. */
export const EMAIL_MAX_LENGTH = 254

/** Koliko se čeka DNS (MX) pre nego što se adresa prihvati bez provere (ADR 0013). */
export const EMAIL_DNS_TIMEOUT_MS = 3000

/** Rezultat MX upita za domen važi sat vremena. */
export const EMAIL_DNS_CACHE_TTL_MS = 60 * 60 * 1000

/**
 * Česti provajderi — za predlog ispravke (`gmial.com` → `gmail.com`). Domen koji JESTE na
 * listi nikad ne dobija predlog, pa i bliski legitimni (`mail.com` uz `gmail.com`) moraju biti tu.
 */
export const COMMON_EMAIL_DOMAINS = [
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.uk',
  'ymail.com',
  'hotmail.com',
  'hotmail.co.uk',
  'outlook.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'me.com',
  'mac.com',
  'aol.com',
  'mail.com',
  'gmx.com',
  'gmx.de',
  'gmx.net',
  'web.de',
  'proton.me',
  'protonmail.com',
  'pm.me',
  'zoho.com',
  'fastmail.com',
  'hey.com',
  'tutanota.com',
  'yandex.com',
  'yandex.ru',
  'mail.ru',
  't-online.de',
  'orange.fr',
  'libero.it',
  'eunet.rs',
  'sbb.rs',
  'mts.rs',
  'open.telekom.rs',
  'ptt.rs',
] as const

/**
 * Koliko izmena se još smatra greškom u kucanju — zavisno od dužine poznatog domena. Kratki
 * domeni su preblizu jedni drugima (`mc.com` je na jednu izmenu od `me.com`, a može biti
 * prava firma), pa predlog dobijaju samo duži: jedna izmena od 8 znakova, dve od 10.
 */
export const EMAIL_TYPO_RULES = [
  { distance: 1, minLength: 8 },
  { distance: 2, minLength: 10 },
] as const

export type EmailRejectReason = 'syntax' | 'typo' | 'disposable' | 'noMx'
