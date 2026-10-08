import type { ControlSize } from '@/constants/theme'

export const BUTTON_PADDING_X: Record<ControlSize, number> = { s: 12, m: 18, l: 26 }

export const BUTTON_FONT_SIZE: Record<ControlSize, string> = { s: '13.5px', m: '14.5px', l: '16.5px' }

/** Veliko dugme (hero, CTA traka) je zaobljenije, kao u dizajnu. */
export const BUTTON_RADIUS: Record<ControlSize, 'base' | 'md'> = { s: 'base', m: 'base', l: 'md' }

/** `mailto:` i `tel:` se otvaraju u istom tabu; `http(s)` u novom. */
export const EXTERNAL_HREF = /^(https?:|mailto:|tel:)/
export const NEW_TAB_HREF = /^https?:/
