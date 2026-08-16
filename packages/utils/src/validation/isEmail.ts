// Namerno pragmatično, ne RFC 5322. Puna RFC provera propušta adrese koje nijedan
// mail server ne prihvata, a odbija validne. Jedini pouzdan test je slanje poruke.
const EMAIL = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function isEmail(value: string): boolean {
  const trimmed = value.trim();
  return trimmed.length <= 254 && EMAIL.test(trimmed);
}
