import { describe, expect, it } from 'vitest';

import { isJMBG } from './isJMBG';

/**
 * Računa kontrolnu cifru za prvih 12 cifara istim algoritmom (modul 11).
 * Test podatke računamo umesto da ih izmišljamo — izmišljen JMBG skoro nikad
 * nema ispravnu kontrolnu cifru.
 */
function withControlDigit(first12: string): string {
  const n = Array.from(first12, Number);
  const at = (i: number): number => n[i] ?? 0;

  const sum =
    7 * (at(0) + at(6)) +
    6 * (at(1) + at(7)) +
    5 * (at(2) + at(8)) +
    4 * (at(3) + at(9)) +
    3 * (at(4) + at(10)) +
    2 * (at(5) + at(11));

  const remainder = 11 - (sum % 11);
  return first12 + String(remainder > 9 ? 0 : remainder);
}

describe('isJMBG', () => {
  it.each([
    ['010199071000', 'Beograd, 01.01.1990.'],
    ['150385080012', 'Vojvodina, 15.03.1985.'],
    ['291292790123', 'prestupni 29.02. — ovde 29.12.'],
  ])('prihvata validan JMBG za %s (%s)', (prefix) => {
    expect(isJMBG(withControlDigit(prefix))).toBe(true);
  });

  it('odbija pogrešnu kontrolnu cifru', () => {
    const valid = withControlDigit('010199071000');
    const broken = valid.slice(0, 12) + String((Number(valid[12]) + 1) % 10);
    expect(isJMBG(broken)).toBe(false);
  });

  it.each([
    ['prekratak', '010199071000'],
    ['predugačak', '01019907100067'],
    ['sa slovima', '01019907100AB'],
    ['prazan', ''],
  ])('odbija %s', (_opis, value) => {
    expect(isJMBG(value)).toBe(false);
  });

  it('odbija nemoguć dan', () => {
    expect(isJMBG(withControlDigit('320199071000'))).toBe(false);
  });

  it('odbija nemoguć mesec', () => {
    expect(isJMBG(withControlDigit('011399071000'))).toBe(false);
  });

  it('odbija nulti dan i nulti mesec', () => {
    expect(isJMBG(withControlDigit('000199071000'))).toBe(false);
    expect(isJMBG(withControlDigit('010099071000'))).toBe(false);
  });

  it('toleriše okolne razmake', () => {
    expect(isJMBG(` ${withControlDigit('010199071000')} `)).toBe(true);
  });

  it('pokriva slučaj kada je ostatak 10 ili 11 — kontrolna cifra je tada 0', () => {
    // Tražimo prefiks čiji zbir daje ostatak koji vodi u granu `remainder > 9`
    const found = Array.from({ length: 1000 }, (_, i) =>
      String(i).padStart(3, '0'),
    )
      .map((suffix) => `010199071${suffix}`)
      .find((prefix) => withControlDigit(prefix).endsWith('0'));

    expect(found).toBeDefined();
    expect(isJMBG(withControlDigit(found ?? ''))).toBe(true);
  });
});
