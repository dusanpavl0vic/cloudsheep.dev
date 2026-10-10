'use client'

import ModalHost from '../ModalHost'
import { OVERLAY_MODALS } from './ModalRoot.constants'

/** Modali javnog sajta (meni na telefonu). Admin ima svoj `AdminModalRoot`. */
const ModalRoot = () => <ModalHost registry={OVERLAY_MODALS} />

export default ModalRoot
