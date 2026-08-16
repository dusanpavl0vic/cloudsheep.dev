import { describe, expect, it } from 'vitest';

import { deepMerge } from './deepMerge';

describe('deepMerge', () => {
  it('spaja ugnježdene objekte', () => {
    expect(deepMerge({ a: { x: 1, y: 2 } }, { a: { y: 3 } })).toEqual({ a: { x: 1, y: 3 } });
  });

  it('source pobeđuje za skalare', () => {
    expect(deepMerge({ a: 1 }, { a: 2 })).toEqual({ a: 2 });
  });

  it('zamenjuje nizove umesto da ih spaja', () => {
    expect(deepMerge({ a: [1, 2] }, { a: [3] })).toEqual({ a: [3] });
  });

  it('dodaje nove ključeve', () => {
    expect(deepMerge({ a: 1 }, { b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('ne mutira ulaze', () => {
    const target = { a: { x: 1 } };
    const source = { a: { y: 2 } };
    deepMerge(target, source);
    expect(target).toEqual({ a: { x: 1 } });
    expect(source).toEqual({ a: { y: 2 } });
  });

  it('Date se zamenjuje, ne spaja po poljima', () => {
    const date = new Date('2026-01-01');
    expect(deepMerge({ d: new Date('2020-01-01') }, { d: date }).d).toBe(date);
  });

  it('null iz source-a briše ugnježdenu vrednost', () => {
    expect(deepMerge({ a: { x: 1 } }, { a: null })).toEqual({ a: null });
  });
});
