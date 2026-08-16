/** Grupiše stavke po ključu koji vraća `selector`. */
export function groupBy<T, K extends PropertyKey>(
  items: readonly T[],
  selector: (item: T) => K,
): Record<K, T[]> {
  const result: Partial<Record<K, T[]>> = {};

  for (const item of items) {
    const key = selector(item);
    const bucket = result[key];
    if (bucket) {
      bucket.push(item);
    } else {
      result[key] = [item];
    }
  }

  return result as Record<K, T[]>;
}
