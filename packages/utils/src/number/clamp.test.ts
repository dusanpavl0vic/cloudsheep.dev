import { describe, expect, it } from 'vitest';

import { clamp } from './clamp';

describe('clamp', () => {
  it.each([
    [5, 0, 10, 5],
    [-1, 0, 10, 0],
    [11, 0, 10, 10],
    [0, 0, 10, 0],
    [10, 0, 10, 10],
    [-5, -10, -1, -5],
  ])('clamp(%i, %i, %i) → %i', (value, min, max, expected) => {
    expect(clamp(value, min, max)).toBe(expected);
  });

  it('baca kad je opseg obrnut — tiho vraćanje bi sakrilo grešku pozivaoca', () => {
    expect(() => clamp(5, 10, 0)).toThrow(RangeError);
  });
});
