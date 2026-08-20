import type { Localized } from '../types'

/**
 * Bira jezik iz dvojezičnog polja.
 *
 * Sve što nije engleski pada na srpski — podrazumevani jezik sajta. Bolje je da posetilac
 * sa nepoznatim kodom jezika vidi srpski nego prazno mesto gde je trebalo da bude naslov.
 */
export const localize = (value: Localized, language: string): string =>
  language.startsWith('en') ? value.en : value.sr
