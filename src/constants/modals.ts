/**
 * Sve što se otvara: dropdown, sheet, dialog, drawer (docs/06-modals.md).
 * `popover` se renderuje pored svog dugmeta; `overlay` preko celog ekrana, kroz `ModalRoot`.
 */
export const MODALS = {
  MOBILE_NAV: 'mobileNav',
  CONFIRM_DIALOG: 'confirmDialog',
  ADMIN_ACCOUNT_MENU: 'adminAccountMenu',
  ADMIN_MESSAGE: 'adminMessage',
  ADMIN_TECHNOLOGY_FORM: 'adminTechnologyForm',
  ADMIN_TEAM_MEMBER_FORM: 'adminTeamMemberForm',
  ADMIN_TESTIMONIAL_FORM: 'adminTestimonialForm',
  ADMIN_SOCIAL_LINK_FORM: 'adminSocialLinkForm',
  ADMIN_SLOT_GENERATOR: 'adminSlotGenerator',
} as const

export type ModalName = (typeof MODALS)[keyof typeof MODALS]

export type ModalKind = 'popover' | 'overlay'

export const MODAL_KIND: Record<ModalName, ModalKind> = {
  mobileNav: 'overlay',
  confirmDialog: 'overlay',
  adminAccountMenu: 'popover',
  adminMessage: 'overlay',
  adminTechnologyForm: 'overlay',
  adminTeamMemberForm: 'overlay',
  adminTestimonialForm: 'overlay',
  adminSocialLinkForm: 'overlay',
  adminSlotGenerator: 'overlay',
}
