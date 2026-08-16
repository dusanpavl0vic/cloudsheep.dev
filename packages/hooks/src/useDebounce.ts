import { useEffect, useState } from 'react';

/**
 * Odloženo praćenje vrednosti — vraća `value` tek kad se smiri na `delay` ms.
 *
 * Za pretragu tokom kucanja prvo razmotri `useDeferredValue`: on ne uvodi tajmer i React
 * sam prekida zastarelo renderovanje. `useDebounce` je pravi izbor kad odlaganje treba da
 * spreči **spoljni posao** — mrežni zahtev, upis u storage — a ne samo rerender.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState(value);

  // effect: timer — odlaganje je spoljni sistem, nema React ekvivalenta za gašenje zahteva
  useEffect(() => {
    const timer = setTimeout(() => { setDebounced(value); }, delay);
    return () => { clearTimeout(timer); };
  }, [value, delay]);

  return debounced;
}
