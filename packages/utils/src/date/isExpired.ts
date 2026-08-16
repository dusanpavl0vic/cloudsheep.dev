/**
 * Da li je trenutak prošao. Sat se injektuje da bi test bio determinističan —
 * direktan `Date.now()` u telu funkcije čini je neproverljivom (docs/14).
 */
export function isExpired(date: Date, now: () => number = Date.now): boolean {
  return date.getTime() < now();
}
