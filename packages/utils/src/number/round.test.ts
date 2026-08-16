import { describe, expect, it } from 'vitest';

import { round } from './round';

describe('round', () => {
  it.each([
    [1.005, 2, 1.01],
    [2.675, 2, 2.68],
    [1.4, 0, 1],
    [1.5, 0, 2],
    [-1.5, 0, -1],
    [123.456, 1, 123.5],
    [10, 2, 10],
  ])('round(%f, %i) → %f', (value, decimals, expected) => {
    expect(round(value, decimals)).toBe(expected);
  });

  it('podrazumevano zaokružuje na ceo broj', () => {
    expect(round(3.7)).toBe(4);
  });

  it('propušta ne-konačne vrednosti netaknute', () => {
    expect(round(Number.NaN)).toBeNaN();
    expect(round(Number.POSITIVE_INFINITY)).toBe(Number.POSITIVE_INFINITY);
  });
});
