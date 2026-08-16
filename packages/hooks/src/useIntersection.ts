import { useEffect, useState, type RefObject } from 'react';

interface UseIntersectionOptions extends IntersectionObserverInit {
  /** Kad je true, prestaje da posmatra posle prvog ulaska — za reveal animacije. */
  once?: boolean;
}

/**
 * Da li je element vidljiv u viewport-u.
 *
 * `IntersectionObserver` je jeftiniji od `scroll` slušaoca: browser računa preklapanje
 * van glavne niti i javlja samo kad se prag pređe.
 */
export function useIntersection(
  ref: RefObject<Element | null>,
  { once = false, ...options }: UseIntersectionOptions = {},
): boolean {
  const [isIntersecting, setIsIntersecting] = useState(false);
  // Raspakovano u primitive da bi dependency array bio stabilan — objekat `options`
  // je nova referenca pri svakom renderu pozivaoca.
  const { root = null, rootMargin = '0px', threshold = 0 } = options;

  // effect: IntersectionObserver — pretplata na browser API, nema React ekvivalenta
  useEffect(() => {
    const element = ref.current;
    if (!element || typeof IntersectionObserver !== 'function') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;

        setIsIntersecting(entry.isIntersecting);
        if (entry.isIntersecting && once) observer.disconnect();
      },
      { root, rootMargin, threshold },
    );

    observer.observe(element);
    return () => { observer.disconnect(); };
  }, [ref, once, root, rootMargin, threshold]);

  return isIntersecting;
}
