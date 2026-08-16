/**
 * Poreski identifikacioni broj — 9 cifara, kontrolna cifra po modulu 11
 * (algoritam Poreske uprave Republike Srbije).
 */
export function isPIB(value: string): boolean {
  const digits = value.trim();
  if (!/^\d{9}$/.test(digits)) return false;

  const n = Array.from(digits, Number);
  let carry = 10;

  for (let i = 0; i < 8; i += 1) {
    /* v8 ignore next -- regex iznad garantuje 9 cifara */
    carry = (((n[i] ?? 0) + carry) % 10 || 10) * 2 % 11;
  }

  const control = (11 - carry) % 10;
  /* v8 ignore next -- isto, n[8] uvek postoji */
  return control === (n[8] ?? -1);
}
