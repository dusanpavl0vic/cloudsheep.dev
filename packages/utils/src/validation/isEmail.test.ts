import { describe, expect, it } from 'vitest';

import { isEmail } from './isEmail';

describe('isEmail', () => {
  it.each(['a@b.rs', 'ime.prezime@primer.co.rs', ' a@b.com '])('validno: %s', (value) => {
    expect(isEmail(value)).toBe(true);
  });

  it.each(['', 'a', 'a@', '@b.rs', 'a@b', 'a b@c.rs', 'a@@b.rs', 'a@b..rs'])(
    'nevalidno: %s',
    (value) => {
      expect(isEmail(value)).toBe(false);
    },
  );

  it('odbija predugačku adresu', () => {
    expect(isEmail(`${'a'.repeat(250)}@b.rs`)).toBe(false);
  });
});
