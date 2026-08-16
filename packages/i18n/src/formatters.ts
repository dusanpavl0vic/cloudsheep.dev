import { getLanguage, type Locale } from './languages'

/**
 * Formatiranje brojeva, datuma i valuta kroz `Intl.*`.
 *
 * Zašto ovde a ne u `@app/utils`: rezultat zavisi od jezika, pa ovo nije čista funkcija
 * u smislu tog paketa (docs/14-helpers-utils.md).
 *
 * `Intl.*` konstruktori su skupi, pa se keširaju po kombinaciji lokala i opcija —
 * u tabeli od 500 redova to je razlika između 500 i 1 konstrukcije.
 */
const cache = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat | Intl.RelativeTimeFormat>()

function cached<T extends Intl.NumberFormat | Intl.DateTimeFormat | Intl.RelativeTimeFormat>(
  key: string,
  create: () => T,
): T {
  const existing = cache.get(key)
  if (existing) return existing as T
  const created = create()
  cache.set(key, created)
  return created
}

const localeOf = (locale: Locale): string => getLanguage(locale).intlLocale

export function formatNumber(
  value: number,
  locale: Locale,
  options: Intl.NumberFormatOptions = {},
): string {
  const intlLocale = localeOf(locale)
  return cached(
    `n:${intlLocale}:${JSON.stringify(options)}`,
    () => new Intl.NumberFormat(intlLocale, options),
  ).format(value)
}

export function formatCurrency(value: number, locale: Locale, currency = 'EUR'): string {
  return formatNumber(value, locale, { style: 'currency', currency })
}

export function formatPercent(value: number, locale: Locale, fractionDigits = 0): string {
  return formatNumber(value, locale, {
    style: 'percent',
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  })
}

export function formatDate(
  date: Date,
  locale: Locale,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  const intlLocale = localeOf(locale)
  return cached(
    `d:${intlLocale}:${JSON.stringify(options)}`,
    () => new Intl.DateTimeFormat(intlLocale, options),
  ).format(date)
}

const RELATIVE_UNITS: readonly (readonly [Intl.RelativeTimeFormatUnit, number])[] = [
  ['year', 31_536_000_000],
  ['month', 2_592_000_000],
  ['week', 604_800_000],
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
  ['second', 1000],
]

/** „pre 3 dana", „za 2 meseca". Sat se injektuje radi testabilnosti. */
export function formatRelative(date: Date, locale: Locale, now: () => number = Date.now): string {
  const intlLocale = localeOf(locale)
  const formatter = cached<Intl.RelativeTimeFormat>(
    `r:${intlLocale}`,
    () => new Intl.RelativeTimeFormat(intlLocale, { numeric: 'auto' }),
  )

  const diff = date.getTime() - now()
  const absolute = Math.abs(diff)

  const match = RELATIVE_UNITS.find(([, ms]) => absolute >= ms)
  if (!match) return formatter.format(0, 'second')

  const [unit, ms] = match
  return formatter.format(Math.round(diff / ms), unit)
}

/** Isprazni keš — potrebno samo u testovima. */
export function clearFormatterCache(): void {
  cache.clear()
}
