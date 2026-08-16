import { describe, expect, it } from 'vitest';

import { isEmpty } from './isEmpty';

describe('isEmpty', () => {
  it.each([null, undefined, '', '   ', [], {}, new Map(), new Set()])('prazno: %s', (value) => {
    expect(isEmpty(value)).toBe(true);
  });

  it.each([0, false, 'a', [1], { a: 1 }, new Map([['a', 1]]), new Set([1])])(
    'nije prazno: %s',
    (value) => {
      expect(isEmpty(value)).toBe(false);
    },
  );

  it('nula i false nisu prazni — to je česta greška', () => {
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(false)).toBe(false);
  });
});
