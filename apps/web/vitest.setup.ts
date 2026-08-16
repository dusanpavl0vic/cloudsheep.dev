import '@testing-library/jest-dom/vitest'

import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// RTL registruje auto-cleanup samo uz `globals: true`; mi ga nemamo, pa ovde
afterEach(() => {
  cleanup()
})
