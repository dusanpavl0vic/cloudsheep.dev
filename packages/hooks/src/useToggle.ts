import { useCallback, useState } from 'react';

/**
 * Boolean prekidač. Jedan od retkih hookova koji vraća niz — imitira `useState`
 * i ima tačno dva člana, što je izuzetak dozvoljen u docs/13-hooks.md.
 */
export function useToggle(initial = false): [boolean, (next?: boolean) => void] {
  const [value, setValue] = useState(initial);

  const toggle = useCallback((next?: boolean) => {
    setValue((current) => next ?? !current);
  }, []);

  return [value, toggle];
}
