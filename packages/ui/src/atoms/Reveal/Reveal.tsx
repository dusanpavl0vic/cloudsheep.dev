import type { ElementType, HTMLAttributes } from 'react'
import { useEffect, useRef } from 'react'

import { revealVariants } from './Reveal.variants'
import { cn } from '../../lib/cn'


type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType
  /** Smer iz kog element uleti kad uđe u viewport. */
  direction?: 'up' | 'left' | 'right'
}

/**
 * Otkriva sadržaj kad uđe u viewport (fade + slide).
 *
 * Animacija se izvodi CSS klasom koju effect postavlja direktno na DOM čvor, bez `useState` —
 * rerender po elementu na svakom skrolu bi bio skuplji od same animacije.
 */
export const Reveal = ({
  as: Comp = 'div',
  direction = 'up',
  className,
  children,
  ...props
}: RevealProps) => {
  const ref = useRef<HTMLElement>(null)

  // effect: IntersectionObserver — pretplata na browser API i imperativna izmena klase
  useEffect(() => {
    const el = ref.current
    // Bez podrške za IntersectionObserver sadržaj ostaje vidljiv umesto da nestane —
    // degradacija mora biti ka prikazanom, nikad ka praznoj stranici
    if (!el || typeof IntersectionObserver !== 'function') return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )

    observer.observe(el)
    return () => { observer.disconnect(); }
  }, [])

  return (
    <Comp ref={ref} className={cn(revealVariants({ direction }), className)} {...props}>
      {children}
    </Comp>
  )
}
