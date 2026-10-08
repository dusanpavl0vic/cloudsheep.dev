/**
 * Opcije upita u tri koraka (dizajn: „Tell us what you are building").
 * Čuvaju se KLJUČEVI, ne prikazani tekst — tekst je u `contact.brief.*` (i18n).
 */
export const BRIEF_TYPES = ['webapp', 'mobile', 'site', 'design'] as const
export type BriefType = (typeof BRIEF_TYPES)[number]

export const BRIEF_BUDGETS = ['under5k', '5to15k', '15to40k', 'over40k'] as const
export type BriefBudget = (typeof BRIEF_BUDGETS)[number]

export const BRIEF_TIMELINES = ['asap', '1to3', '3to6', 'flexible'] as const
export type BriefTimeline = (typeof BRIEF_TIMELINES)[number]

export const BRIEF_STEPS = 3

export const CONTACT_LIMITS = {
  nameMax: 120,
  messageMin: 10,
  messageMax: 5000,
} as const
