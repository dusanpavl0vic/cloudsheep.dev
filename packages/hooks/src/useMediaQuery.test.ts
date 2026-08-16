import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useMediaQuery } from './useMediaQuery';

type Listener = () => void;

/** Zamena za matchMedia sa ručnom kontrolom nad promenom. */
function mockMatchMedia(initial: boolean) {
  const listeners = new Set<Listener>();
  let matches = initial;

  const mql = {
    get matches() { return matches; },
    addEventListener: (_: string, fn: Listener) => listeners.add(fn),
    removeEventListener: (_: string, fn: Listener) => listeners.delete(fn),
  };

  vi.stubGlobal('matchMedia', vi.fn(() => mql));

  return {
    setMatches(next: boolean) {
      matches = next;
      listeners.forEach((fn) => { fn(); });
    },
    get listenerCount() { return listeners.size; },
  };
}

describe('useMediaQuery', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('vraća početno poklapanje', () => {
    mockMatchMedia(true);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(true);
  });

  it('reaguje na promenu', () => {
    const media = mockMatchMedia(false);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(result.current).toBe(false);
    act(() => { media.setMatches(true); });
    expect(result.current).toBe(true);
  });

  it('odjavljuje slušaoca pri unmount-u', () => {
    const media = mockMatchMedia(false);
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));

    expect(media.listenerCount).toBe(1);
    unmount();
    expect(media.listenerCount).toBe(0);
  });

  it('vraća false kad matchMedia ne postoji', () => {
    vi.stubGlobal('matchMedia', undefined);
    const { result } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(result.current).toBe(false);
  });

  it('unmount bez matchMedia ne pada — no-op odjava', () => {
    vi.stubGlobal('matchMedia', undefined);
    const { unmount } = renderHook(() => useMediaQuery('(min-width: 768px)'));
    expect(() => { unmount(); }).not.toThrow();
  });

  it('ponovo se pretplaćuje kad se query promeni', () => {
    const media = mockMatchMedia(false);
    const { rerender } = renderHook(({ q }) => useMediaQuery(q), {
      initialProps: { q: '(min-width: 768px)' },
    });

    expect(media.listenerCount).toBe(1);
    rerender({ q: '(min-width: 1024px)' });
    expect(media.listenerCount).toBe(1);
  });
});
