/**
 * Zaokružuje na zadat broj decimala bez greške binarne aritmetike.
 * `Math.round(1.005 * 100) / 100` daje 1 — eksponencijalni zapis to izbegava.
 */
export function round(value: number, decimals = 0): number {
  if (!Number.isFinite(value)) return value;
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}
