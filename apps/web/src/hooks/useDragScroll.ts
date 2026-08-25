import { useLayoutEffect, useRef } from 'react'

/**
 * Vodoravno skrolovanje **prevlačenjem kursora**.
 *
 * `overflow-x-auto` sam pokriva prst i trackpad, ali ne i miš: mišem se traka može pomeriti
 * samo ako korisnik nađe skrol traku — a ona je namerno sakrivena. Otud ovo.
 *
 * **Ne koristi `useState`.** Prevlačenje menja `scrollLeft` desetine puta u sekundi; kroz
 * state bi to bio isto toliko rendera po pokretu, a ništa u JSX-u ne zavisi od te vrednosti.
 * Sve stoji u `ref`-ovima, a jedina vidljiva promena je `cursor`, koja ide preko klase.
 *
 * **Pointer događaji, ne mouse.** Jedan skup pokriva miš, pero i dodir; `touch-action` u CSS-u
 * ostaje netaknut, pa nativno prevlačenje prstom radi kao i pre — ovo mu se ne meša.
 *
 * `setPointerCapture` je nužan: bez njega prevlačenje prestaje čim kursor izađe iz trake,
 * što se pri brzom pokretu dešava stalno.
 *
 * Prag od 4px razdvaja prevlačenje od klika. Bez njega bi svaki klik na karticu bio i
 * mikro-pomeraj, pa bi linkovi unutar trake postali nepouzdani.
 */
const DRAG_THRESHOLD = 4

interface DragScrollOptions {
  /**
   * Gde traka stoji pri prvom prikazu.
   *
   * `center` je za slučaj kad su kartice ukras bez redosleda: prvi kadar tada pokazuje
   * SREDINU niza, pa se odmah vidi da ima sadržaja i levo i desno. Sa `start` se vidi samo
   * prva kartica i deo druge, što izgleda kao da traka tu i počinje i završava se.
   */
  startAt?: 'start' | 'center'
}

export const useDragScroll = <T extends HTMLElement>({
  startAt = 'start',
}: DragScrollOptions = {}) => {
  const ref = useRef<T>(null)
  const start = useRef<{ x: number; scroll: number } | null>(null)
  const dragged = useRef(false)

  // effect: pozicija skrola na DOM čvoru trake — spoljni sistem.
  //
  // `useLayoutEffect`, ne `useEffect`: pozicija se mora podesiti PRE iscrtavanja, inače
  // posetilac vidi traku na početku pa kadar kasnije skoči na sredinu.
  //
  // Postavlja se `scrollLeft`, ne `scrollTo({behavior})`: `scroll-behavior: smooth` stoji na
  // `<html>`, ne na traci, pa je ovaj pomak ionako trenutan — a `Element.scrollTo` u jsdom-u
  // ne postoji, pa bi ga svaki test koji renderuje hero srušio.
  useLayoutEffect(() => {
    const el = ref.current
    if (!el || startAt !== 'center') return

    el.scrollLeft = (el.scrollWidth - el.clientWidth) / 2
  }, [startAt])

  const onPointerDown = (event: React.PointerEvent<T>) => {
    // Prevlačenje prstom već radi nativno i glatko — dupliranje bi ga usporilo
    if (event.pointerType === 'touch') return

    const el = ref.current
    if (!el) return

    start.current = { x: event.clientX, scroll: el.scrollLeft }
    dragged.current = false
    el.setPointerCapture(event.pointerId)
  }

  const onPointerMove = (event: React.PointerEvent<T>) => {
    const el = ref.current
    const from = start.current
    if (!el || !from) return

    const delta = event.clientX - from.x
    if (!dragged.current && Math.abs(delta) < DRAG_THRESHOLD) return

    dragged.current = true
    el.scrollLeft = from.scroll - delta
  }

  const onPointerUp = (event: React.PointerEvent<T>) => {
    const el = ref.current
    if (el?.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId)
    start.current = null
  }

  /**
   * Klik koji je zapravo bio prevlačenje se guši u fazi HVATANJA, pre nego što stigne do
   * kartice. Bez toga bi otpuštanje posle pomeraja otvorilo link ispod prsta.
   */
  const onClickCapture = (event: React.MouseEvent<T>) => {
    if (!dragged.current) return
    event.preventDefault()
    event.stopPropagation()
    dragged.current = false
  }

  return {
    ref,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel: onPointerUp,
    onClickCapture,
  }
}
