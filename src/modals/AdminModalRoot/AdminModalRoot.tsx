'use client'

import ModalHost from '../ModalHost'
import { ADMIN_OVERLAY_MODALS } from './AdminModalRoot.constants'

/** Modali admin-a (potvrda, forme). Renderuje se samo u `app/admin/layout.tsx`. */
const AdminModalRoot = () => <ModalHost registry={ADMIN_OVERLAY_MODALS} />

export default AdminModalRoot
