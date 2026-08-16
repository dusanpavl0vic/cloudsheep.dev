import { describe, expect, it } from 'vitest';

import { sortBy } from './sortBy';

describe('sortBy', () => {
  it('sortira rastuće po broju', () => {
    expect(sortBy([{ n: 3 }, { n: 1 }, { n: 2 }], (i) => i.n)).toEqual([{ n: 1 }, { n: 2 }, { n: 3 }]);
  });

  it('sortira opadajuće', () => {
    expect(sortBy([1, 3, 2], (n) => n, 'desc')).toEqual([3, 2, 1]);
  });

  it('koristi localeCompare za stringove — dijakritici na pravom mestu', () => {
    expect(sortBy(['žaba', 'ananas', 'čvarak'], (s) => s)).toEqual(['ananas', 'čvarak', 'žaba']);
  });

  it('ne mutira ulaz', () => {
    const items = [3, 1, 2];
    sortBy(items, (n) => n);
    expect(items).toEqual([3, 1, 2]);
  });

  it('stabilan je za jednake ključeve', () => {
    const items = [{ k: 1, id: 'a' }, { k: 1, id: 'b' }];
    expect(sortBy(items, (i) => i.k)).toEqual(items);
  });

  it('prazan niz', () => {
    expect(sortBy([], (x) => x)).toEqual([]);
  });
});
