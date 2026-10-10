import { createNavigation } from 'next-intl/navigation'

import { routing } from './routing'

/**
 * `Link`, `useRouter`, `redirect` koji sami dodaju jezički prefiks.
 * Javni sajt ih uvozi odavde, nikad iz `next/link` / `next/navigation` (lint).
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
