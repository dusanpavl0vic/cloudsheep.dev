const MS_PER_DAY = 86_400_000;

/** Ceo broj dana između dva trenutka (b − a), po UTC ponoći — bez uticaja letnjeg računanja. */
export function diffInDays(a: Date, b: Date): number {
  const utc = (d: Date) => Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return Math.round((utc(b) - utc(a)) / MS_PER_DAY);
}
