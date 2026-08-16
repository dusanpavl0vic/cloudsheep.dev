import { describe, expect, it } from 'vitest';

import { isPIB } from './isPIB';

/** Računa ispravnu kontrolnu cifru istim algoritmom — dokazuje da provera prolazi za validne. */
function withControlDigit(first8: string): string {
  let carry = 10;
  for (const ch of first8) {
    carry = (((Number(ch) + carry) % 10 || 10) * 2) % 11;
  }
  return first8 + String((11 - carry) % 10);
}

describe('isPIB', () => {
  it.each(['10000000', '12345678', '98765432'])('prihvata validan PIB za prefiks %s', (prefix) => {
    expect(isPIB(withControlDigit(prefix))).toBe(true);
  });

  it('odbija pogrešnu kontrolnu cifru', () => {
    const valid = withControlDigit('12345678');
    const broken = valid.slice(0, 8) + String((Number(valid[8]) + 1) % 10);
    expect(isPIB(broken)).toBe(false);
  });

  it.each([
    ['prekratak', '12345678'],
    ['predugačak', '1234567890'],
    ['sa slovima', '12345678X'],
    ['prazan', ''],
  ])('odbija %s', (_opis, value) => {
    expect(isPIB(value)).toBe(false);
  });

  it('toleriše okolne razmake', () => {
    expect(isPIB(` ${withControlDigit('12345678')} `)).toBe(true);
  });
});
