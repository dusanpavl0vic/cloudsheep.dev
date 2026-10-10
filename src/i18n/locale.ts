import { setRequestLocale } from 'next-intl/server'

import type { Locale } from '@/constants/i18n'

/**
 * Vezuje jezik iz `[locale]` za tekući zahtev, da serverske komponente ispod ne moraju da ga
 * dobiju kroz props.
 *
 * next-intl 4 ga označava kao zastareo u korist `next/root-params`, koji radi samo kad je
 * `[locale]` KORENSKI layout. Ovde to nije: koren je `app/layout.tsx`, jer admin nema jezik u
 * URL-u, a `global-not-found` (potreban za više korenskih layout-a) je u Next 16.3 eksperimentalan.
 * Okidač za prelazak je u ADR 0012. Jedino mesto sa ovim pozivom.
 */
export const bindRequestLocale = (locale: Locale) => {
  // eslint-disable-next-line @typescript-eslint/no-deprecated
  setRequestLocale(locale)
}
