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
