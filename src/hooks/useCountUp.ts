'use client'

import { useEffect, useState } from 'react'

/**
 * Broj koji „naraste" od 0 do cilja kad se pokrene (ease-out). Pre pokretanja i uz
 * `prefers-reduced-motion` vraća cilj odmah — bez JS-a i za čitač ekrana broj je tačan.
 */
export const useCountUp = (target: number, start: boolean, durationMs = 1900) => {
  const [value, setValue] = useState<number | null>(null)

  // effect: requestAnimationFrame petlja za animaciju broja
  useEffect(() => {
    if (!start || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    let startedAt: number | null = null
    const step = (now: number) => {
      startedAt ??= now
      const progress = Math.min(1, (now - startedAt) / durationMs)
      setValue(target * (1 - Math.pow(1 - progress, 4)))
      if (progress < 1) frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(frame)
    }
  }, [target, start, durationMs])

  return value ?? target
}
