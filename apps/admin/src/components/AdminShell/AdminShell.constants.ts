import { ROUTES } from '@/lib/routes'

/**
 * Navigacija kao podaci — dodavanje stranice je red u nizu, ne novi JSX.
 *
 * Stoji u zasebnom fajlu jer je čitaju DVA mesta: bočna traka (`AdminShell`) i mobilni
 * panel (`AdminNav`). Dok je postojala samo traka, niz je živeo u njoj.
 */
export const NAV = [
  { to: ROUTES.DASHBOARD, labelKey: 'nav.dashboard', end: true },
  { to: ROUTES.PROJECTS, labelKey: 'nav.projects', end: false },
  { to: ROUTES.TECHNOLOGIES, labelKey: 'nav.technologies', end: false },
  { to: ROUTES.PROFILE, labelKey: 'nav.profile', end: false },
  { to: ROUTES.TEAM, labelKey: 'nav.team', end: false },
  { to: ROUTES.MESSAGES, labelKey: 'nav.messages', end: false },
] as const
