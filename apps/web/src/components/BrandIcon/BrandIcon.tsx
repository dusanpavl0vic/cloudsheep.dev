import type { SVGProps } from 'react'

/**
 * Ikone ljuske kao inline SVG.
 *
 * Počelo je od brend ikona: lucide-react je u 1.0 uklonio Github i Linkedin zbog žigova, pa
 * su nacrtane ovde umesto da se doda druga biblioteka zbog dva glifa.
 *
 * Kasnije su im se pridružile i ikone iz zaglavlja i podnožja, i to iz merljivog razloga:
 * `LanguageSwitcher`, `ThemeToggle` i `SiteFooter` žive u ljusci, pa je njihovih pet lucide
 * ikonica vuklo `createLucideIcon` i pet modula u **početno učitavanje** — na budžetu koji je
 * bio probijen. Ikonice na lazy rutama (`UsesPage`) i dalje idu iz lucide-a; tamo ne smetaju.
 *
 * Sve kroz `currentColor`, kako docs/08-styling-ui.md ionako propisuje: tema radi sama.
 */

type BrandIconProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox' | 'fill'>

const base = {
  viewBox: '0 0 24 24',
  fill: 'currentColor',
  'aria-hidden': true,
  focusable: false,
} as const

/** Linijske ikone — isti viewBox, ali obris umesto popune, kao lucide original. */
const stroke = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
} as const

export const GithubIcon = ({ className, ...props }: BrandIconProps) => (
  <svg {...base} className={className} {...props}>
    <path d="M12 .5a12 12 0 0 0-3.79 23.4c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.13-.3-.54-1.52.11-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.65 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.62-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58A12 12 0 0 0 12 .5Z" />
  </svg>
)

export const LinkedinIcon = ({ className, ...props }: BrandIconProps) => (
  <svg {...base} className={className} {...props}>
    <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05a3.74 3.74 0 0 1 3.37-1.85c3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13Zm1.78 13.02H3.55V9h3.57v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z" />
  </svg>
)

export const SunIcon = ({ className, ...props }: BrandIconProps) => (
  <svg {...stroke} className={className} {...props}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
)

export const MoonIcon = ({ className, ...props }: BrandIconProps) => (
  <svg {...stroke} className={className} {...props}>
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
)

export const CheckIcon = ({ className, ...props }: BrandIconProps) => (
  <svg {...stroke} className={className} {...props}>
    <path d="m20 6-11 11-5-5" />
  </svg>
)

export const ChevronDownIcon = ({ className, ...props }: BrandIconProps) => (
  <svg {...stroke} className={className} {...props}>
    <path d="m6 9 6 6 6-6" />
  </svg>
)

export const MenuIcon = ({ className, ...props }: BrandIconProps) => (
  <svg {...stroke} className={className} {...props}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
)

export const CloseIcon = ({ className, ...props }: BrandIconProps) => (
  <svg {...stroke} className={className} {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)

export const MailIcon = ({ className, ...props }: BrandIconProps) => (
  <svg {...stroke} className={className} {...props}>
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
)
