import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { toHaveNoViolations } from 'jest-axe'
import { afterEach, expect } from 'vitest'

// jest-axe umesto vitest-axe (docs/16 §1.5 C)
expect.extend(toHaveNoViolations)

// RTL registruje auto-cleanup samo uz `globals: true`; mi ga nemamo, pa ovde
afterEach(() => {
  cleanup()
})
