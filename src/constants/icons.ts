/**
 * Ikonice koje aplikacija koristi (lucide). Spisak je zatvoren namerno: `Icon` uvozi samo ove,
 * pa bundle ne raste sa svakom ikonicom iz biblioteke (docs/07-performance.md §6).
 */
export const ICON_NAMES = [
  'arrowRight',
  'arrowLeft',
  'arrowUpRight',
  'arrowDown',
  'check',
  'close',
  'menu',
  'mail',
  'plus',
  'minus',
  'chevronDown',
  'chevronUp',
  'chevronLeft',
  'chevronRight',
  'calendar',
  'clock',
  'globe',
  'phone',
  'monitor',
  'smartphone',
  'logOut',
  'trash',
  'edit',
  'upload',
  'download',
  'eye',
  'eyeOff',
  'grip',
] as const

export type IconName = (typeof ICON_NAMES)[number]
