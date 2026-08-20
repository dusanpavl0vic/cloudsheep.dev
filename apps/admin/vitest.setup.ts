import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// jsdom nema top-layer, pa `<dialog>` nema ni `showModal()` ni `close()`. Bez ovoga
// `Dialog` iz `@app/ui` puca pri otvaranju i nijedan modal se ne renderuje u testu.
// Isti polyfill stoji u `apps/web/vitest.setup.ts` i `packages/ui/vitest.setup.ts`.
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

afterEach(() => {
  cleanup()
})
