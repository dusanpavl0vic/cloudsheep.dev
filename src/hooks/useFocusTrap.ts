'use client'

import { useEffect, type RefObject } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select, textarea, [tabindex]:not([tabindex="-1"])'

/**
 * Tab ne izlazi iz otvorenog dijaloga; pri zatvaranju fokus se vraća onome ko ga je otvorio
 * (docs/15-accessibility.md §4).
 */
export const useFocusTrap = (ref: RefObject<HTMLElement | null>, active: boolean) => {
  // effect: fokus u DOM-u — prvi element na otvaranju, vraćanje na zatvaranju
  useEffect(() => {
    const root = ref.current
    if (!active || !root) return

    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null
    const items = () => Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE))
    items()[0]?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const list = items()
      const first = list[0]
      const last = list.at(-1)
      if (!first || !last) return
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    root.addEventListener('keydown', onKey)
    return () => {
      root.removeEventListener('keydown', onKey)
      previous?.focus()
    }
  }, [ref, active])
}
