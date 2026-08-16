type Plain = Record<string, unknown>;

const isPlainObject = (value: unknown): value is Plain =>
  typeof value === 'object' && value !== null && !Array.isArray(value) && !(value instanceof Date);

/**
 * Duboko spaja dva objekta; `source` pobeđuje. Nizovi se zamenjuju, ne spajaju —
 * spajanje nizova je skoro uvek pogrešno za konfiguraciju.
 */
export function deepMerge<T extends Plain>(target: T, source: Plain): T {
  const result: Plain = { ...target };
  for (const [key, value] of Object.entries(source)) {
    const existing = result[key];
    result[key] = isPlainObject(existing) && isPlainObject(value)
      ? deepMerge(existing, value)
      : value;
  }
  return result as T;
}
