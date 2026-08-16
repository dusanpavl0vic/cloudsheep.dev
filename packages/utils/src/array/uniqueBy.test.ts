import { describe, expect, it } from 'vitest';

import { uniqueBy } from './uniqueBy';

describe('uniqueBy', () => {
  it('zadržava prvo pojavljivanje', () => {
    const items = [
      { id: 1, v: 'prvi' },
      { id: 2, v: 'drugi' },
      { id: 1, v: 'treci' },
    ];
    expect(uniqueBy(items, (i) => i.id)).toEqual([
      { id: 1, v: 'prvi' },
      { id: 2, v: 'drugi' },
    ]);
  });

  it('radi sa primitivima', () => {
    expect(uniqueBy([1, 2, 2, 3, 1], (n) => n)).toEqual([1, 2, 3]);
  });

  it('vraća prazan niz za prazan ulaz', () => {
    expect(uniqueBy([], (x) => x)).toEqual([]);
  });

  it('ne mutira ulaz', () => {
    const items = [1, 1, 2];
    uniqueBy(items, (n) => n);
    expect(items).toEqual([1, 1, 2]);
  });
});
