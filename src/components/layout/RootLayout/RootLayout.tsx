import ModalRoot from '@/modals/ModalRoot'

import type { RootLayoutProps } from './RootLayout.types'

/**
 * Koren svake stranice: ovde je `ModalRoot` (javni modali), jer koristi ruter (šablon §3.4).
 * Toast poruke i admin modali su samo u admin layout-u — javni sajt ih ne prikazuje, a JS
 * javnih stranica ih ne nosi (ADR 0014).
 */
const RootLayout = ({ children }: RootLayoutProps) => (
  <>
    {children}
    <ModalRoot />
  </>
)

export default RootLayout
