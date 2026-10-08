export type ControlSize = 's' | 'm' | 'l'

/** S 36 · M 44 · L 52 — 44 je minimum za dodir (docs/15-accessibility.md). */
export const BUTTON_HEIGHTS: Record<ControlSize, number> = { s: 36, m: 44, l: 52 }

export const AVATAR_SIZES: Record<ControlSize, number> = { s: 28, m: 40, l: 56 }

export const ICON_SIZES: Record<ControlSize, number> = { s: 14, m: 18, l: 22 }

export const ASPECT_RATIOS = {
  square: '1 / 1',
  photo: '4 / 3',
  wide: '16 / 9',
  phone: '9 / 19.5',
  browser: '16 / 10',
} as const
