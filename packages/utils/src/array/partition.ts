/** Deli niz na [oni koji prolaze, oni koji ne prolaze]. */
export function partition<T>(
  items: readonly T[],
  predicate: (item: T, index: number) => boolean,
): [pass: T[], fail: T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  items.forEach((item, index) => {
    (predicate(item, index) ? pass : fail).push(item);
  });
  return [pass, fail];
}
