'use client'

import { useEffect, useState, type RefObject } from 'react'

/** Da li je element ušao u ekran (jednom — posle toga ostaje `true`). */
export const useInView = (ref: RefObject<Element | null>, threshold = 0.3) => {
  const [inView, setInView] = useState(false)

  // effect: IntersectionObserver nad elementom
  useEffect(() => {
    const el = ref.current
    if (!el || inView) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold },
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
    }
  }, [ref, threshold, inView])

  return inView
}
