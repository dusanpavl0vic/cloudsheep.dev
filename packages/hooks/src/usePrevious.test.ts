import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { usePrevious } from './usePrevious';

describe('usePrevious', () => {
  it('pri prvom renderu vraća undefined', () => {
    const { result } = renderHook(() => usePrevious('a'));
    expect(result.current).toBeUndefined();
  });

  it('vraća vrednost iz prethodnog rendera', () => {
    const { result, rerender } = renderHook(({ v }) => usePrevious(v), {
      initialProps: { v: 'a' },
    });

    rerender({ v: 'b' });
    expect(result.current).toBe('a');

    rerender({ v: 'c' });
    expect(result.current).toBe('b');
  });

  it('ostaje undefined dok se vrednost stvarno ne promeni', () => {
    // Semantika: "prethodna" je vrednost pre poslednje PROMENE. Ako promene nije bilo,
    // prethodne vrednosti nema. Stara ref+effect implementacija je ovde vraćala 'a',
    // što je bilo zbunjujuće — ista vrednost prijavljena i kao trenutna i kao prethodna.
    const { result, rerender } = renderHook(({ v }) => usePrevious(v), {
      initialProps: { v: 'a' },
    });

    rerender({ v: 'a' });
    expect(result.current).toBeUndefined();
  });

  it('zadržava prethodnu vrednost kroz rerender bez promene', () => {
    const { result, rerender } = renderHook(({ v }) => usePrevious(v), {
      initialProps: { v: 'a' },
    });

    rerender({ v: 'b' });
    expect(result.current).toBe('a');

    rerender({ v: 'b' });
    expect(result.current).toBe('a');
  });

  it('poredi po Object.is — NaN se ne računa kao promena', () => {
    const { result, rerender } = renderHook(({ v }) => usePrevious(v), {
      initialProps: { v: Number.NaN },
    });

    rerender({ v: Number.NaN });
    expect(result.current).toBeUndefined();
  });

  it('radi sa objektima', () => {
    const first = { id: 1 };
    const second = { id: 2 };
    const { result, rerender } = renderHook(({ v }) => usePrevious(v), {
      initialProps: { v: first },
    });

    rerender({ v: second });
    expect(result.current).toBe(first);
  });
});
