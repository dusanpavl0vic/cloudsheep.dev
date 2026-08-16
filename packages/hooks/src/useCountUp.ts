import { useEffect, useState } from 'react'

interface UseCountUpOptions {
  /** Animacija kreće tek kad je `true` — obično kad element uđe u viewport. */
  active?: boolean
  /** Trajanje u ms. */
  duration?: number
  /** Broj decimala; zaokruživanje se radi na svakom koraku da ispis ne trepće. */
  decimals?: number
  /** Preskače animaciju i odmah vraća ciljnu vrednost (`prefers-reduced-motion`). */
  immediate?: boolean
}

/** easeOutExpo — brzo krene, meko stane; čita se kao „stiglo je", ne kao „staje". */
const easeOutExpo = (t: number): number => (t === 1 ? 1 : 1 - 2 ** (-10 * t))

/**
 * Odbrojava od nule do ciljne vrednosti.
 *
 * Koristi `requestAnimationFrame`, ne `setInterval`: rAF se sinhronizuje sa osvežavanjem
 * ekrana, pauzira se kad je tab u pozadini i ne gomila zaostale korake.
 *
 * Mirna i `immediate` grana se **izvode tokom rendera**, ne kroz `setState` u effect-u —
 * to bi bio kaskadni render koji `eslint-plugin-react-hooks` v7 s pravom odbija.
 *
 * Vraća broj, ne formatiran string: formatiranje zavisi od jezika i pripada `@app/i18n`.
 */
export function useCountUp(
  target: number,
  { active = true, duration = 1400, decimals = 0, immediate = false }: UseCountUpOptions = {},
): number {
  const [animated, setAnimated] = useState(0)
  const shouldAnimate = active && !immediate

  // effect: requestAnimationFrame — animacija po kadru je spoljni sistem bez React ekvivalenta
  useEffect(() => {
    if (!shouldAnimate) return

    const factor = 10 ** decimals
    const start = performance.now()
    let frame = 0

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setAnimated(Math.round(target * easeOutExpo(progress) * factor) / factor)

      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(frame)
    }
  }, [target, shouldAnimate, duration, decimals])

  if (immediate) return target
  if (!active) return 0
  return animated
}
