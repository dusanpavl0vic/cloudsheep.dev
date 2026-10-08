import en from './en'
import type { Locale } from './locales'
import sr from './sr'
import type { Messages } from './types'

/** Sve poruke po jeziku. Uvozi ga samo server (`i18n/request.ts`) — klijent dobija izbor. */
export const MESSAGES: Record<Locale, Messages> = { en, sr }
