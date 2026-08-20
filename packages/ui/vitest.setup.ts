import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { toHaveNoViolations } from 'jest-axe'
import { afterEach, expect } from 'vitest'

// jest-axe umesto vitest-axe — vitest-axe je poslednji put objavljen 2022 (docs/16 §1.5 C)
expect.extend(toHaveNoViolations)

// jsdom nema top-layer, pa `<dialog>` nema ni `showModal()` ni `close()`.
// Zamenjeni su najmanjim ponašanjem od kog `Dialog` zavisi: `open` atribut i native
// `close` događaj. Isti polyfill stoji u `apps/web/vitest.setup.ts`.
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

// RTL registruje auto-cleanup samo uz `globals: true`. Mi ga nemamo (eksplicitni importi
// su čitljiviji), pa se čišćenje registruje ovde — bez njega DOM curi između testova
// i getByRole nalazi elemente iz prethodnog testa.
afterEach(() => {
  cleanup()
})
