/**
 * Srpski broj telefona u međunarodnom (+381…) ili lokalnom (0…) formatu.
 * Dozvoljeni su razmaci, crtice i zagrade — korisnici ih kucaju, a mi ih ne teramo da ne kucaju.
 */
export function isPhoneRS(value: string): boolean {
  const cleaned = value.replace(/[\s\-()/.]/g, '');
  // +381 ili 00381 → nacionalni broj bez vodeće nule, 8 ili 9 cifara
  if (/^(\+381|00381)\d{8,9}$/.test(cleaned)) return !cleaned.startsWith('+3810');
  // lokalni: 0 + 8 ili 9 cifara
  return /^0\d{8,9}$/.test(cleaned);
}
