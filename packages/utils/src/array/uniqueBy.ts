/** Uklanja duplikate, zadržavajući prvo pojavljivanje po ključu. */
export function uniqueBy<T>(items: readonly T[], selector: (item: T) => unknown): T[] {
  const seen = new Set<unknown>();
  const result: T[] = [];

  for (const item of items) {
    const key = selector(item);
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(item);
  }

  return result;
}
