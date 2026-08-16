import { describe, expect, it } from 'vitest';

import { pick } from './pick';

describe('pick', () => {
  it('uzima navedene ključeve', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('preskače ključeve kojih nema', () => {
    const source: { a: number; b?: number } = { a: 1 };
    expect(pick(source, ['a', 'b'])).toEqual({ a: 1 });
  });

  it('prazna lista daje prazan objekat', () => {
    expect(pick({ a: 1 }, [])).toEqual({});
  });

  it('ne mutira izvor', () => {
    const source = { a: 1, b: 2 };
    pick(source, ['a']);
    expect(source).toEqual({ a: 1, b: 2 });
  });

  it('zadržava vrednost undefined ako ključ postoji', () => {
    expect(pick({ a: undefined }, ['a'])).toEqual({ a: undefined });
  });
});
