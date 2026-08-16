import { useEffect, useRef, useState } from 'react'

/**
 * Kuca zadate fraze slovo po slovo u petlji (piše → pauza → briše → sledeća).
 * Timer-driven animacija je legitiman useEffect; poštuje prefers-reduced-motion
 * (tada prikaže prvu frazu u celosti, bez animacije).
 */
export const useTypewriter = (phrases: readonly string[]) => {
  const [text, setText] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => {
    if (phrases.length === 0) return

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      setText(phrases[0] ?? '')
      return
    }

    let phrase = 0
    let index = 0
    let deleting = false

    const tick = () => {
      const current = phrases[phrase]
      if (!current) return
      index += deleting ? -1 : 1
      setText(current.slice(0, index))

      if (!deleting && index >= current.length) {
        deleting = true
        timer.current = setTimeout(tick, 1700)
        return
      }
      if (deleting && index <= 0) {
        deleting = false
        phrase = (phrase + 1) % phrases.length
      }
      timer.current = setTimeout(tick, deleting ? 40 : 70)
    }

    timer.current = setTimeout(tick, 700)
    return () => { clearTimeout(timer.current); }
  }, [phrases])

  return text
}
