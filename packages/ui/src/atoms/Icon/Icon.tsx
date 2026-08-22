import type { SVGProps } from 'react'

/**
 * Ikone ljuske koje trebaju OBEMA app-ama.
 *
 * Živele su u `apps/web/src/components/BrandIcon`, gde im je i mesto bilo dok je postojao
 * jedan korisnik. Kad je `admin` dobio isti mobilni panel, pravilo iz `/CLAUDE.md` je
 * odlučilo: kod ide u `packages/` tek kad ga koristi druga app — a sada ga koristi.
 *
 * Ovde su samo **generične** ikone. Brend glifovi (`GithubIcon`, `LinkedinIcon`) i one
 * vezane za javni sajt (`SunIcon`, `MailIcon`…) ostaju u `web`-u: paket dizajn sistema
 * nema razloga da nosi žigove tuđih firmi.
 *
 * Razlog zašto su ručno crtane, a ne iz lucide-a, nije se promenio: `lucide-react` bi u
 * **početni chunk** uneo `createLucideIcon` i po modul za svaki glif, a ljuska se učitava
 * na svakoj ruti. Za dva `path`-a to se ne isplati.
 *
 * Sve kroz `currentColor` — tema radi sama (docs/08).
 */
type IconProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox' | 'fill'>

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

export const MenuIcon = ({ className, ...props }: IconProps) => (
  <svg {...stroke} className={className} {...props}>
    <path d="M3 6h18M3 12h18M3 18h18" />
  </svg>
)

export const CloseIcon = ({ className, ...props }: IconProps) => (
  <svg {...stroke} className={className} {...props}>
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
)
