/**
 * Jedinstveni matični broj građana — 13 cifara sa kontrolnom cifrom po modulu 11.
 *
 * Format: DDMMGGG RR BBB K
 * Kontrola: m = 11 − ((7(a+g) + 6(b+h) + 5(c+i) + 4(d+j) + 3(e+k) + 2(f+l)) mod 11)
 * Ako je m između 1 i 9 → kontrolna cifra je m; ako je 10 ili 11 → 0.
 */
export function isJMBG(value: string): boolean {
  const digits = value.trim();
  if (!/^\d{13}$/.test(digits)) return false;

  const n = Array.from(digits, Number);
  /* v8 ignore next -- regex iznad garantuje 13 cifara, indeks ne može da promaši */
  const at = (i: number): number => n[i] ?? 0;

  const day = at(0) * 10 + at(1);
  const month = at(2) * 10 + at(3);
  if (day < 1 || day > 31 || month < 1 || month > 12) return false;

  const sum =
    7 * (at(0) + at(6)) +
    6 * (at(1) + at(7)) +
    5 * (at(2) + at(8)) +
    4 * (at(3) + at(9)) +
    3 * (at(4) + at(10)) +
    2 * (at(5) + at(11));

  const remainder = 11 - (sum % 11);
  const control = remainder > 9 ? 0 : remainder;

  return control === at(12);
}
