// @vitest-environment jsdom
import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useScrollEffects } from './useScrollEffects'

/** `matchMedia` koji uvek vraća isto — jsdom ga nema. */
const stubDesktop = (matches: boolean) => {
  vi.stubGlobal('matchMedia', () => ({
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))
}

const card = () => document.querySelector<HTMLElement>('[data-pin-card="1"]')

describe('useScrollEffects', () => {
  beforeEach(() => {
    vi.stubGlobal('requestAnimationFrame', vi.fn())
    vi.stubGlobal('cancelAnimationFrame', vi.fn())
    vi.spyOn(window, 'innerHeight', 'get').mockReturnValue(800)
    document.body.innerHTML =
      '<section data-pin><li data-pin-card="0"></li><li data-pin-card="1"></li></section>'
    const pin = document.querySelector<HTMLElement>('[data-pin]')
    if (pin) pin.getBoundingClientRect = () => ({ top: -900, height: 3000 }) as DOMRect
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('ispod desktopa ne kači proces — karte ostaju lista, bez upisanog stila', () => {
    stubDesktop(false)

    renderHook(() => {
      useScrollEffects(true)
    })

    expect(card()?.style.transform).toBe('')
    expect(card()?.style.opacity).toBe('')
  })

  it('na desktopu kači proces, a cleanup briše upisano (smanjeno kretanje posle hidratacije)', () => {
    stubDesktop(true)

    const { unmount } = renderHook(() => {
      useScrollEffects(true)
    })
    expect(card()?.style.transform).not.toBe('')

    unmount()

    expect(card()?.style.transform).toBe('')
    expect(card()?.style.opacity).toBe('')
  })
})
