import { Z_INDEX } from '@/constants/layout'
import {
  AVATAR_SIZES,
  BLUR,
  BREAKPOINTS,
  BUTTON_HEIGHTS,
  COLORS,
  FONT_FAMILY,
  ICON_SIZES,
  MEDIA,
  RADII,
  SHADOWS,
  SPACING,
  TYPOGRAPHY,
} from '@/constants/theme'

/** Tema se sastavlja iz tokena iz `constants/theme`. Boje su CSS promenljive (ADR 0010). */
export const theme = {
  colors: COLORS,
  fonts: FONT_FAMILY,
  typography: TYPOGRAPHY,
  spacing: SPACING,
  radii: RADII,
  shadows: SHADOWS,
  blur: BLUR,
  breakpoints: BREAKPOINTS,
  media: MEDIA,
  zIndex: Z_INDEX,
  buttonHeights: BUTTON_HEIGHTS,
  avatarSizes: AVATAR_SIZES,
  iconSizes: ICON_SIZES,
} as const

export type AppTheme = typeof theme
