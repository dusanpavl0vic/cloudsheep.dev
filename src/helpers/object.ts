/** Novi objekat samo sa navedenim ključevima. */
export const pick = <T extends object, K extends keyof T>(
  source: T,
  keys: readonly K[],
): Pick<T, K> =>
  Object.fromEntries(keys.filter((key) => key in source).map((key) => [key, source[key]])) as Pick<
    T,
    K
  >

/** Novi objekat bez navedenih ključeva. */
export const omit = <T extends object, K extends keyof T>(
  source: T,
  keys: readonly K[],
): Omit<T, K> =>
  Object.fromEntries(Object.entries(source).filter(([key]) => !keys.includes(key as K))) as Omit<
    T,
    K
  >

export const isEmpty = (value: object) => Object.keys(value).length === 0

/**
 * Kao `pick`, ali po putanjama sa tačkom (`'home.estimator'`): rezultat čuva istu ugnežđenost,
 * pa `useTranslations('home.estimator')` radi nad isečkom kao nad celim objektom.
 */
export const pickPaths = (source: Record<string, unknown>, paths: readonly string[]) => {
  const result: Record<string, unknown> = {}
  for (const path of paths) {
    const keys = path.split('.')
    let from: unknown = source
    for (const key of keys) from = from && typeof from === 'object' ? (from as Record<string, unknown>)[key] : undefined
    if (from === undefined) continue

    let to = result
    keys.slice(0, -1).forEach((key) => {
      const next = to[key]
      to[key] = next && typeof next === 'object' ? next : {}
      to = to[key] as Record<string, unknown>
    })
    to[keys[keys.length - 1] ?? path] = from
  }
  return result
}
