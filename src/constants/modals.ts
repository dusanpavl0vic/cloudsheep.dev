/**
 * Sve što se otvara: dropdown, sheet, dialog, drawer (docs/06-modals.md).
 * `popover` se renderuje pored svog dugmeta; `overlay` preko celog ekrana, kroz `ModalRoot`.
 */
export const MODALS = {
  MOBILE_NAV: 'mobileNav',
  CONFIRM_DIALOG: 'confirmDialog',
  ADMIN_TECHNOLOGY_FORM: 'adminTechnologyForm',
  ADMIN_TEAM_MEMBER_FORM: 'adminTeamMemberForm',
  ADMIN_TESTIMONIAL_FORM: 'adminTestimonialForm',
  ADMIN_SOCIAL_LINK_FORM: 'adminSocialLinkForm',
} as const

export type ModalName = (typeof MODALS)[keyof typeof MODALS]

export type ModalKind = 'popover' | 'overlay'

export const MODAL_KIND: Record<ModalName, ModalKind> = {
  mobileNav: 'overlay',
  confirmDialog: 'overlay',
  adminTechnologyForm: 'overlay',
  adminTeamMemberForm: 'overlay',
  adminTestimonialForm: 'overlay',
  adminSocialLinkForm: 'overlay',
}
