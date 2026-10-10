'use client'

import { useState } from 'react'

/**
 * Kružni karusel: aktivni indeks, sledeći/prethodni i pomeraj svake stavke od aktivne
 * (najkraćim putem oko kruga — za 4 stavke i aktivnu 0, stavka 3 je na −1, ne na +3).
 */
export const useCarousel = (count: number, initial = 0) => {
  const [active, setActive] = useState(Math.min(initial, Math.max(0, count - 1)))

  const goTo = (index: number) => {
    setActive(((index % count) + count) % count)
  }

  const offsetOf = (index: number) => {
    let offset = index - active
    const half = Math.floor(count / 2)
    if (offset > half) offset -= count
    if (offset < -half) offset += count
    return offset
  }

  return {
    active,
    goTo,
    next: () => {
      goTo(active + 1)
    },
    prev: () => {
      goTo(active - 1)
    },
    offsetOf,
  }
}
