import type { ElementType, HTMLAttributes } from 'react'
import { useEffect, useRef } from 'react'

import { cn } from '@/lib/cn'

import { revealVariants } from './Reveal.variants'

type RevealProps = HTMLAttributes<HTMLElement> & {
  as?: ElementType
  /** Smer iz kog element uleti kad uđe u viewport. */
  direction?: 'up' | 'left' | 'right'
}

/**
 * Otkriva sadržaj kad uđe u viewport (fade + slide). IntersectionObserver je
 * subscribe na browser event — jedan od opravdanih slučajeva za useEffect (PROJECT_GUIDE 2.1).
 */
export const Reveal = ({
  as: Comp = 'div',
  direction = 'up',
  className,
  children,
  ...props
}: RevealProps) => {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

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
    return () => observer.disconnect()
  }, [])

  return (
    <Comp ref={ref} className={cn(revealVariants({ direction }), className)} {...props}>
      {children}
    </Comp>
  )
}
