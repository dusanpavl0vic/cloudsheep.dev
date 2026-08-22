import { useEffect, useRef, useState } from 'react'

import { useMediaQuery } from './useMediaQuery'

/**
 * Otvaranje i zatvaranje native `<dialog>`-a preko `showModal()`.
 *
 * **Zašto platforma, a ne Radix.** `showModal()` sam daje zamku fokusa, zatvaranje na `Esc`,
 * inertnu pozadinu i `::backdrop` — sve ono zbog čega se dijalog obično uzima iz biblioteke.
 * `@radix-ui/react-dialog` bi to isto uneo u **početni chunk**, jer zaglavlje stoji u ljusci
 * i učitava se na svakoj ruti. Isti razlog iz kog FAQ koristi `<details>`
 * (`apps/web/CLAUDE.md`, „Prvo platforma, pa biblioteka").
 *
 * Ulazna i izlazna animacija su čist CSS (`.nav-sheet` u `animations.css`), pa se zatvaranje
 * traži kroz `close()`, a stanje se menja tek kad platforma potvrdi — nikad obrnuto.
 *
 * @param closeAbove media query iznad kog dijalog nema smisla (npr. desktop širina).
 */
export const useNativeDialog = (closeAbove: string) => {
  const ref = useRef<HTMLDialogElement>(null)
  const [open, setOpen] = useState(false)
  const isAbove = useMediaQuery(closeAbove)

  // effect: slušanje na DOM čvoru dijaloga — spoljni sistem.
  // Oba događaja idu ovde, a ne kao JSX propsi, iz istog razloga: `close` pokriva i `Esc`
  // i naše dugme, a klik na pozadinu je jedina stvar koju native `<dialog>` NE radi sam —
  // cilj klika je tada sam `<dialog>`, jer je sadržaj u detetu.
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const handleClose = () => {
      setOpen(false)
    }
    const handleClick = (event: MouseEvent) => {
      if (event.target === el) el.close()
    }

    el.addEventListener('close', handleClose)
    el.addEventListener('click', handleClick)
    return () => {
      el.removeEventListener('close', handleClose)
      el.removeEventListener('click', handleClick)
    }
  }, [])

  // effect: sinhronizacija sa širinom prozora — spoljni sistem.
  // Bez ovoga bi panel otvoren na tabletu ostao otvoren posle rotacije u desktop širinu,
  // a sa njim i inertna pozadina: stranica bi izgledala živo i ne bi primala klikove.
  useEffect(() => {
    if (isAbove) ref.current?.close()
  }, [isAbove])

  const show = () => {
    ref.current?.showModal()
    setOpen(true)
  }
  const close = () => {
    ref.current?.close()
  }

  return { ref, open, show, close }
}
