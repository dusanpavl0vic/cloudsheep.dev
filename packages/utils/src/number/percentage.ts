/** Udeo dela u celini, u procentima. Celina 0 daje 0 umesto NaN. */
export function percentage(part: number, total: number, decimals = 0): number {
  if (total === 0) return 0;
  const factor = 10 ** decimals;
  return Math.round(((part / total) * 100 + Number.EPSILON) * factor) / factor;
}
