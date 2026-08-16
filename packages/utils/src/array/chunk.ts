/** Deli niz na komade zadate veličine; poslednji može biti kraći. */
export function chunk<T>(items: readonly T[], size: number): T[][] {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError(`chunk: veličina mora biti ceo broj >= 1, dobijeno ${String(size)}`);
  }
  const result: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    result.push(items.slice(i, i + size));
  }
  return result;
}
