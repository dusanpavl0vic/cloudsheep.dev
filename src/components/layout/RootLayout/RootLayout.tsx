import ToastContainer from '@/components/feedback/ToastContainer'
import ModalRoot from '@/modals/ModalRoot'

import type { RootLayoutProps } from './RootLayout.types'

/** Koren svake stranice: ovde su ModalRoot i ToastContainer, jer koriste ruter (šablon §3.4). */
const RootLayout = ({ children }: RootLayoutProps) => (
  <>
    {children}
    <ModalRoot />
    <ToastContainer />
  </>
)

export default RootLayout
