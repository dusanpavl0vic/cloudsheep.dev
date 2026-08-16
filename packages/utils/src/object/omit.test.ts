import { describe, expect, it } from 'vitest';

import { omit } from './omit';

describe('omit', () => {
  it('izostavlja navedene ključeve', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 });
  });

  it('prazna lista vraća kopiju', () => {
    expect(omit({ a: 1 }, [])).toEqual({ a: 1 });
  });

  it('ključ kog nema ne smeta', () => {
    const source: { a: number; b?: number } = { a: 1 };
    expect(omit(source, ['b'])).toEqual({ a: 1 });
  });

  it('ne mutira izvor', () => {
    const source = { a: 1, b: 2 };
    omit(source, ['a']);
    expect(source).toEqual({ a: 1, b: 2 });
  });
});
