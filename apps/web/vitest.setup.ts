import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { toHaveNoViolations } from 'jest-axe'
import { afterEach, expect, vi } from 'vitest'

// jest-axe umesto vitest-axe (docs/16 §1.5 C)
expect.extend(toHaveNoViolations)

/**
 * jsdom nema `matchMedia`, a `themeSlice` ga zove **pri importu modula** (početna tema iz
 * `prefers-color-scheme`). Zato stub mora ovde, a ne u `beforeAll` pojedinačnog testa —
 * do tada je import već pao. Podrazumevano ništa ne odgovara: testovi koji zavise od
 * konkretnog upita neka ga sami prepišu.
 */
vi.stubGlobal(
  'matchMedia',
  vi.fn((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
)

/**
 * jsdom nema top-layer, pa `<dialog>` nema ni `showModal()` ni `close()`.
 * Zamenjeni su najmanjim ponašanjem od kog kod zavisi: `open` atribut i native `close`
 * događaj — tačno ono na šta se `useNativeDialog` oslanja.
 */
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal = function showModal() {
    this.open = true
  }
  HTMLDialogElement.prototype.close = function close() {
    if (!this.open) return
    this.open = false
    this.dispatchEvent(new Event('close'))
  }
}

// RTL registruje auto-cleanup samo uz `globals: true`; mi ga nemamo, pa ovde
afterEach(() => {
  cleanup()
})
