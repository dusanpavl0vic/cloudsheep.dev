// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { applyPin, resetPin } from './applyPin'

/** Zakačena sekcija sa tri karte, dva koraka i trakom napretka. */
const mountPin = () => {
  document.body.innerHTML = `
    <section data-pin>
      <li data-pin-step="0"></li><li data-pin-step="1"></li>
      <div data-pin-fill></div>
      <li data-pin-card="0"></li><li data-pin-card="1"></li><li data-pin-card="2"></li>
    </section>`
  const pin = document.querySelector<HTMLElement>('[data-pin]')
  if (!pin) throw new Error('pin')
  return pin
}

const cards = () => [...document.querySelectorAll<HTMLElement>('[data-pin-card]')]

/** Položaj skrola u kom je druga karta na vrhu špila, a treća tek ulazi odozdo (pozicija 1.2). */
const scrollToSecondCard = (pin: HTMLElement) => {
  pin.getBoundingClientRect = () => ({ top: -1178.6, height: 3000 }) as DOMRect
}

describe('applyPin', () => {
  beforeEach(() => {
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('karta na vrhu špila je puna — kroz providnu se čitao tekst karte ispod nje', () => {
    const pin = mountPin()
    scrollToSecondCard(pin)

    applyPin(pin)

    const [behind, top, entering] = cards()
    expect(top?.style.opacity).toBe('1')
    expect(Number(behind?.style.opacity)).toBeLessThan(1)
    expect(Number(entering?.style.opacity)).toBeLessThan(1)
  })

  it('resetPin vraća karte, korake i traku u stanje iz CSS-a', () => {
    const pin = mountPin()
    scrollToSecondCard(pin)
    applyPin(pin)

    resetPin(pin)

    for (const card of cards()) {
      expect(card.style.transform).toBe('')
      expect(card.style.opacity).toBe('')
      expect(card.style.filter).toBe('')
    }
    expect(document.querySelector<HTMLElement>('[data-pin-fill]')?.style.width).toBe('')
    expect(document.querySelector('[aria-current]')).toBeNull()
  })
})
