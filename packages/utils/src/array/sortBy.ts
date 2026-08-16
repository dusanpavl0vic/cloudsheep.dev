/**
 * Sortira po ključu, bez mutacije ulaza (`toSorted`).
 * `direction` menja smer; poređenje stringova ide preko `localeCompare` radi dijakritika.
 */
export function sortBy<T>(
  items: readonly T[],
  selector: (item: T) => string | number,
  direction: 'asc' | 'desc' = 'asc',
): T[] {
  const sign = direction === 'asc' ? 1 : -1;
  return items.toSorted((a, b) => {
    const left = selector(a);
    const right = selector(b);
    if (typeof left === 'string' && typeof right === 'string') {
      return left.localeCompare(right) * sign;
    }
    return (left < right ? -1 : left > right ? 1 : 0) * sign;
  });
}
