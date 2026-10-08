export const THEME_MODES = ['light', 'dark'] as const
export type ThemeMode = (typeof THEME_MODES)[number]

export const isThemeMode = (value: unknown): value is ThemeMode =>
  THEME_MODES.includes(value as ThemeMode)
