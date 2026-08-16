import { describe, expect, it } from 'vitest';

import { partition } from './partition';

describe('partition', () => {
  it('razdvaja po uslovu', () => {
    expect(partition([1, 2, 3, 4], (n) => n % 2 === 0)).toEqual([[2, 4], [1, 3]]);
  });

  it('prosleđuje indeks', () => {
    expect(partition(['a', 'b', 'c'], (_, i) => i > 0)).toEqual([['b', 'c'], ['a']]);
  });

  it('sve prolazi', () => {
    expect(partition([1, 2], () => true)).toEqual([[1, 2], []]);
  });

  it('ništa ne prolazi', () => {
    expect(partition([1, 2], () => false)).toEqual([[], [1, 2]]);
  });

  it('prazan niz', () => {
    expect(partition([], () => true)).toEqual([[], []]);
  });
});
