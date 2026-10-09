// @vitest-environment jsdom
import { renderHook } from '@testing-library/react'
import { StrictMode } from 'react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useRevealOnScroll } from './useRevealOnScroll'

/** IntersectionObserver koji pamti posmatrane elemente — jsdom ga nema. */
const observed = new Set<Element>()

class FakeObserver {
  observe = (el: Element) => observed.add(el)
  unobserve = (el: Element) => observed.delete(el)
  disconnect = () => {
    observed.clear()
  }
}

describe('useRevealOnScroll', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', FakeObserver)
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800)
    document.body.innerHTML = '<section data-reveal></section>'
    const el = document.querySelector('section')
    if (el) el.getBoundingClientRect = () => ({ top: 2000 }) as DOMRect
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    observed.clear()
  })

  it('posle dvostrukog efekta (Strict Mode) element je i dalje posmatran — ne ostaje nevidljiv', () => {
    renderHook(() => {
      useRevealOnScroll(true)
    }, { wrapper: StrictMode })

    const el = document.querySelector('section')
    expect(el?.style.opacity).toBe('0')
    expect(el && observed.has(el)).toBe(true)
  })

  it('cleanup vraća neotkriven element u početno stanje', () => {
    const { unmount } = renderHook(() => {
      useRevealOnScroll(true)
    })
    unmount()

    const el = document.querySelector('section')
    expect(el?.style.opacity).toBe('')
    expect(el?.hasAttribute('data-revealed')).toBe(false)
  })
})
