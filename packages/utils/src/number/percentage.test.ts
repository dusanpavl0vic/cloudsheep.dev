import { describe, expect, it } from 'vitest';

import { percentage } from './percentage';

describe('percentage', () => {
  it.each([
    [25, 100, 0, 25],
    [1, 3, 2, 33.33],
    [0, 10, 0, 0],
    [10, 10, 0, 100],
    [3, 8, 1, 37.5],
  ])('percentage(%i, %i, %i) → %f', (part, total, decimals, expected) => {
    expect(percentage(part, total, decimals)).toBe(expected);
  });

  it('vraća 0 umesto NaN kad je celina nula', () => {
    expect(percentage(5, 0)).toBe(0);
  });
});
