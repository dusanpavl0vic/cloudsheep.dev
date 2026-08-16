import { useCallback, useSyncExternalStore } from 'react';

/**
 * Prati CSS media query.
 *
 * Koristi `useSyncExternalStore`, ne `useEffect` + `useState`: to je tačno ono za šta
 * je taj hook napravljen — čitanje iz spoljnog izvora bez rizika od zastarelog stanja
 * pri konkurentnom renderovanju (docs/07 §3).
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof globalThis.matchMedia !== 'function') return () => undefined;
      const list = globalThis.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => { list.removeEventListener('change', onChange); };
    },
    [query],
  );

  const getSnapshot = useCallback(
    () => (typeof globalThis.matchMedia === 'function' ? globalThis.matchMedia(query).matches : false),
    [query],
  );

  // Server nema matchMedia — vrati false umesto da pukne pri hidrataciji
  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
