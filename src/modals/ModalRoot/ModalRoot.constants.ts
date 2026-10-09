import { lazy, type ComponentType } from 'react'

import type { ModalName } from '@/constants/modals'

import type { OverlayModalProps } from '../shared/types'

/**
 * Registar overlay modala. Svaki je `lazy` — kod modala stiže tek pri prvom otvaranju,
 * pa nijedan nije u početnom JS-u (docs/06-modals.md §4).
 */
export const OVERLAY_MODALS: Partial<Record<ModalName, ComponentType<OverlayModalProps>>> = {
  mobileNav: lazy(() => import('../MobileNav')),
  confirmDialog: lazy(() => import('../ConfirmDialog')) as ComponentType<OverlayModalProps>,
  adminTechnologyForm: lazy(() => import('../TechnologyFormModal')) as ComponentType<OverlayModalProps>,
  adminTeamMemberForm: lazy(() => import('../TeamMemberFormModal')) as ComponentType<OverlayModalProps>,
  adminSocialLinkForm: lazy(() => import('../SocialLinkFormModal')) as ComponentType<OverlayModalProps>,
  adminTestimonialForm: lazy(() => import('../TestimonialFormModal')) as ComponentType<OverlayModalProps>,
}
