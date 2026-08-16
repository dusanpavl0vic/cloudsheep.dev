import { describe, expect, it } from 'vitest';

import { groupBy } from './groupBy';

describe('groupBy', () => {
  it('grupiše po vrednosti ključa', () => {
    const items = [
      { id: 1, tip: 'a' },
      { id: 2, tip: 'b' },
      { id: 3, tip: 'a' },
    ];
    expect(groupBy(items, (i) => i.tip)).toEqual({
      a: [{ id: 1, tip: 'a' }, { id: 3, tip: 'a' }],
      b: [{ id: 2, tip: 'b' }],
    });
  });

  it('vraća prazan objekat za prazan niz', () => {
    expect(groupBy([], () => 'x')).toEqual({});
  });

  it('podržava numeričke ključeve', () => {
    expect(groupBy([1, 2, 3, 4], (n) => n % 2)).toEqual({ 0: [2, 4], 1: [1, 3] });
  });

  it('ne mutira ulaz', () => {
    const items = [1, 2];
    groupBy(items, (n) => n);
    expect(items).toEqual([1, 2]);
  });
});
