import { describe, expect, it } from 'vitest';

import { buildQuery } from './buildQuery';

describe('buildQuery', () => {
  it('gradi query sa prefiksom', () => {
    expect(buildQuery({ tag: 'react', page: 2 })).toBe('?tag=react&page=2');
  });

  it('izostavlja prazne vrednosti', () => {
    expect(buildQuery({ a: '', b: null, c: undefined, d: 'x' })).toBe('?d=x');
  });

  it('vraća prazan string kad nema ničega', () => {
    expect(buildQuery({})).toBe('');
    expect(buildQuery({ a: null })).toBe('');
  });

  it('ponavlja ključ za niz', () => {
    expect(buildQuery({ tag: ['a', 'b'] })).toBe('?tag=a&tag=b');
  });

  it('zadržava false i nulu — to su vrednosti, ne praznine', () => {
    expect(buildQuery({ active: false, count: 0 })).toBe('?active=false&count=0');
  });

  it('enkodira specijalne znakove', () => {
    expect(buildQuery({ q: 'a b&c' })).toBe('?q=a+b%26c');
  });
});
