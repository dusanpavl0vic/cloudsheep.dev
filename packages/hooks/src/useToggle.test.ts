import { act, renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useToggle } from './useToggle';

describe('useToggle', () => {
  it('podrazumevano kreće od false', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current[0]).toBe(false);
  });

  it('poštuje početnu vrednost', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current[0]).toBe(true);
  });

  it('okreće vrednost', () => {
    const { result } = renderHook(() => useToggle());

    act(() => { result.current[1](); });
    expect(result.current[0]).toBe(true);

    act(() => { result.current[1](); });
    expect(result.current[0]).toBe(false);
  });

  it('postavlja eksplicitnu vrednost', () => {
    const { result } = renderHook(() => useToggle());

    act(() => { result.current[1](true); });
    expect(result.current[0]).toBe(true);

    act(() => { result.current[1](true); });
    expect(result.current[0]).toBe(true);
  });

  it('funkcija je referencijalno stabilna', () => {
    const { result, rerender } = renderHook(() => useToggle());
    const first = result.current[1];

    rerender();
    expect(result.current[1]).toBe(first);
  });
});
