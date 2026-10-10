/**
 * Mere dugmeta po veličini — `.yak.ts`, jer ih stil čita u build-u (ADR 0015). Veliko dugme
 * (hero, CTA traka) je zaobljenije, kao u dizajnu.
 */
import { BUTTON_HEIGHTS } from '../../../constants/theme/sizes.ts'
import { RADII } from '../../../constants/theme/spacing.ts'

export const BUTTON_SIZES = {
  s: { height: BUTTON_HEIGHTS.s, paddingX: 12, fontSize: '13.5px', radius: RADII.base, weight: 600 },
  m: { height: BUTTON_HEIGHTS.m, paddingX: 18, fontSize: '14.5px', radius: RADII.base, weight: 600 },
  l: { height: BUTTON_HEIGHTS.l, paddingX: 26, fontSize: '16.5px', radius: RADII.md, weight: 700 },
} as const
