import { lazy, type ComponentType } from 'react'

import type { ModalRegistry } from '../ModalHost'
import type { OverlayModalProps } from '../shared/types'

/** Registar admin modala — renderuje ga samo admin layout (vidi `ModalRoot.constants.ts`). */
export const ADMIN_OVERLAY_MODALS: ModalRegistry = {
  confirmDialog: lazy(() => import('../ConfirmDialog')) as ComponentType<OverlayModalProps>,
  adminTechnologyForm: lazy(() => import('../TechnologyFormModal')) as ComponentType<OverlayModalProps>,
  adminTeamMemberForm: lazy(() => import('../TeamMemberFormModal')) as ComponentType<OverlayModalProps>,
  adminSocialLinkForm: lazy(() => import('../SocialLinkFormModal')) as ComponentType<OverlayModalProps>,
  adminTestimonialForm: lazy(() => import('../TestimonialFormModal')) as ComponentType<OverlayModalProps>,
}
