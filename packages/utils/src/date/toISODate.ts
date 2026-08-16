/** `YYYY-MM-DD` u UTC. Za prikaz korisniku koristi formattere iz `@app/i18n`. */
export function toISODate(date: Date): string {
  if (Number.isNaN(date.getTime())) throw new RangeError('toISODate: neispravan datum');
  return date.toISOString().slice(0, 10);
}
