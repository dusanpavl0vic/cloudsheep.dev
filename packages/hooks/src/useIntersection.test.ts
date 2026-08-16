import { act, renderHook } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { useIntersection } from './useIntersection';

type Callback = (entries: { isIntersecting: boolean }[]) => void;

function mockObserver() {
  const instances: { callback: Callback; disconnect: () => void; observe: () => void }[] = [];

  class FakeObserver {
    callback: Callback;
    observe = vi.fn();
    disconnect = vi.fn();

    constructor(callback: Callback) {
      this.callback = callback;
      instances.push(this);
    }
  }

  vi.stubGlobal('IntersectionObserver', FakeObserver);
  return {
    trigger(isIntersecting: boolean) {
      instances.at(-1)?.callback([{ isIntersecting }]);
    },
    get last() { return instances.at(-1); },
    get count() { return instances.length; },
  };
}

describe('useIntersection', () => {
  afterEach(() => { vi.unstubAllGlobals(); });

  it('kreće od false', () => {
    mockObserver();
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useIntersection(ref));
    expect(result.current).toBe(false);
  });

  it('postaje true kad element uđe u viewport', () => {
    const observer = mockObserver();
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useIntersection(ref));

    act(() => { observer.trigger(true); });
    expect(result.current).toBe(true);
  });

  it('vraća se na false kad element izađe', () => {
    const observer = mockObserver();
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useIntersection(ref));

    act(() => { observer.trigger(true); });
    act(() => { observer.trigger(false); });
    expect(result.current).toBe(false);
  });

  it('sa once prestaje da posmatra posle prvog ulaska', () => {
    const observer = mockObserver();
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useIntersection(ref, { once: true }));

    act(() => { observer.trigger(true); });
    expect(result.current).toBe(true);
    expect(observer.last?.disconnect).toHaveBeenCalled();
  });

  it('ne pravi observer bez elementa', () => {
    const observer = mockObserver();
    const ref = { current: null };
    renderHook(() => useIntersection(ref));
    expect(observer.count).toBe(0);
  });

  it('ne pada kad IntersectionObserver ne postoji', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    const ref = { current: document.createElement('div') };
    const { result } = renderHook(() => useIntersection(ref));
    expect(result.current).toBe(false);
  });

  it('prekida posmatranje pri unmount-u', () => {
    const observer = mockObserver();
    const ref = { current: document.createElement('div') };
    const { unmount } = renderHook(() => useIntersection(ref));

    unmount();
    expect(observer.last?.disconnect).toHaveBeenCalled();
  });
});
