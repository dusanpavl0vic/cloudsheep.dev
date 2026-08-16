/** Novi objekat bez navedenih ključeva. */
export function omit<T extends object, K extends keyof T>(source: T, keys: readonly K[]): Omit<T, K> {
  const excluded = new Set<PropertyKey>(keys);
  const result = {} as Record<PropertyKey, unknown>;
  for (const [key, value] of Object.entries(source)) {
    if (!excluded.has(key)) result[key] = value;
  }
  return result as Omit<T, K>;
}
