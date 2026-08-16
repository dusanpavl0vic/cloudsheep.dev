import { useEffect, useRef, useState } from 'react'

import { useMediaQuery } from '@app/hooks'

/**
 * Kuca zadate fraze slovo po slovo u petlji (piše → pauza → briše → sledeća).
 * Timer-driven animacija je legitiman useEffect; poštuje prefers-reduced-motion
 * (tada prikaže prvu frazu u celosti, bez animacije).
 */
export const useTypewriter = (phrases: readonly string[]) => {
  // Čita se tokom rendera preko useSyncExternalStore, ne postavlja iz effect-a —
  // setState u effect-u pokreće kaskadni render (docs/07 §3, docs/15).
  const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [text, setText] = useState('')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  // effect: setTimeout — animacija kucanja je tajmer, spoljni sistem bez React ekvivalenta
  useEffect(() => {
    if (phrases.length === 0 || prefersReduced) return

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
  }, [phrases, prefersReduced])

  // Bez animacije: odmah pun tekst, bez trepćuće faze
  return prefersReduced ? (phrases[0] ?? '') : text
}
