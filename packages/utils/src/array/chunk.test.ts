import { describe, expect, it } from 'vitest';

import { chunk } from './chunk';

describe('chunk', () => {
  it('deli na jednake komade', () => {
    expect(chunk([1, 2, 3, 4], 2)).toEqual([[1, 2], [3, 4]]);
  });

  it('poslednji komad može biti kraći', () => {
    expect(chunk([1, 2, 3], 2)).toEqual([[1, 2], [3]]);
  });

  it('veličina veća od niza daje jedan komad', () => {
    expect(chunk([1, 2], 5)).toEqual([[1, 2]]);
  });

  it('prazan niz daje prazan rezultat', () => {
    expect(chunk([], 2)).toEqual([]);
  });

  it.each([0, -1, 1.5, Number.NaN])('baca za neispravnu veličinu %s', (size) => {
    expect(() => chunk([1, 2], size)).toThrow(RangeError);
  });
});
