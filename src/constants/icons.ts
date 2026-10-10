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
  'chevronDown',
  'chevronUp',
  'logOut',
  'trash',
  'edit',
  'upload',
  'download',
] as const

export type IconName = (typeof ICON_NAMES)[number]
