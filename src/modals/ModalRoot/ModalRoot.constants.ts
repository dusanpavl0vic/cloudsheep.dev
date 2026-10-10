import { lazy } from 'react'

import type { ModalRegistry } from '../ModalHost'

/**
 * Registar modala javnog sajta. Svaki je `lazy` — kod modala stiže tek pri prvom otvaranju
 * (docs/06-modals.md §4). Admin modali su u `AdminModalRoot`, ne ovde: i `lazy` referenca
 * drži njihove zavisnosti u grafu, pa bi izvozi koje koriste ostali u JS-u javnih stranica.
 */
export const OVERLAY_MODALS: ModalRegistry = {
  mobileNav: lazy(() => import('../MobileNav')),
}
