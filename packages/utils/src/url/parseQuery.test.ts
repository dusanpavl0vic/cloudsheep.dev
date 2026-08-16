import { describe, expect, it } from 'vitest';

import { parseQuery } from './parseQuery';

describe('parseQuery', () => {
  it('čita sa prefiksom i bez njega', () => {
    expect(parseQuery('?a=1&b=2')).toEqual({ a: '1', b: '2' });
    expect(parseQuery('a=1&b=2')).toEqual({ a: '1', b: '2' });
  });

  it('ponovljeni ključ postaje niz', () => {
    expect(parseQuery('?tag=a&tag=b')).toEqual({ tag: ['a', 'b'] });
  });

  it('prazan ulaz daje prazan objekat', () => {
    expect(parseQuery('')).toEqual({});
    expect(parseQuery('?')).toEqual({});
  });

  it('ključ bez vrednosti daje prazan string', () => {
    expect(parseQuery('?a')).toEqual({ a: '' });
  });

  it('dekodira specijalne znakove', () => {
    expect(parseQuery('?q=a+b%26c')).toEqual({ q: 'a b&c' });
  });
});
