import '@testing-library/jest-dom/vitest';

import { cleanup } from '@testing-library/react';
import { toHaveNoViolations } from 'jest-axe';
import { afterEach, expect } from 'vitest';

// jest-axe umesto vitest-axe — vitest-axe je poslednji put objavljen 2022 (docs/16 §1.5 C)
expect.extend(toHaveNoViolations);

// RTL registruje auto-cleanup samo uz `globals: true`. Mi ga nemamo (eksplicitni importi
// su čitljiviji), pa se čišćenje registruje ovde — bez njega DOM curi između testova
// i getByRole nalazi elemente iz prethodnog testa.
afterEach(() => {
  cleanup();
});
