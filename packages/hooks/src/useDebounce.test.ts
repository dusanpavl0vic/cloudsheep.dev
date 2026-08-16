import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('odmah vraća početnu vrednost', () => {
    const { result } = renderHook(() => useDebounce('a', 100));
    expect(result.current).toBe('a');
  });

  it('ne menja vrednost pre isteka roka', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 100), {
      initialProps: { v: 'a' },
    });

    rerender({ v: 'b' });
    act(() => { vi.advanceTimersByTime(99); });
    expect(result.current).toBe('a');
  });

  it('menja vrednost po isteku roka', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 100), {
      initialProps: { v: 'a' },
    });

    rerender({ v: 'b' });
    act(() => { vi.advanceTimersByTime(100); });
    expect(result.current).toBe('b');
  });

  it('brza uzastopna promena daje samo poslednju vrednost', () => {
    const { result, rerender } = renderHook(({ v }) => useDebounce(v, 100), {
      initialProps: { v: 'a' },
    });

    rerender({ v: 'b' });
    act(() => { vi.advanceTimersByTime(50); });
    rerender({ v: 'c' });
    act(() => { vi.advanceTimersByTime(50); });
    expect(result.current).toBe('a');

    act(() => { vi.advanceTimersByTime(50); });
    expect(result.current).toBe('c');
  });

  it('čisti tajmer pri unmount-u', () => {
    const clearSpy = vi.spyOn(globalThis, 'clearTimeout');
    const { unmount } = renderHook(() => useDebounce('a', 100));
    unmount();
    expect(clearSpy).toHaveBeenCalled();
  });
});
