import type { SVGProps } from 'react'

/**
 * Logotipi tehnologija kao inline SVG.
 *
 * Pisani ručno, ne skinuti sa interneta: `docs/08-styling-ui.md` traži očišćen SVG sa
 * `currentColor` i bez `<rect>` pozadine, a ručno pisana putanja ne uvodi fajl iz
 * neproverenog izvora. Isti obrazac koristi `components/BrandIcon`.
 *
 * Svi su monohromni i uzimaju boju od roditelja — traka radi i na svetloj i na tamnoj podlozi.
 */

type IconProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'viewBox'>

const base = {
  viewBox: '0 0 24 24',
  'aria-hidden': true,
  focusable: false,
} as const

const ReactIcon = (props: IconProps) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.1" {...props}>
    <circle cx="12" cy="12" r="2.05" fill="currentColor" stroke="none" />
    <ellipse cx="12" cy="12" rx="10.5" ry="4.05" />
    <ellipse cx="12" cy="12" rx="10.5" ry="4.05" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10.5" ry="4.05" transform="rotate(120 12 12)" />
  </svg>
)

const NextIcon = (props: IconProps) => (
  <svg {...base} fill="currentColor" {...props}>
    <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12c2.3 0 4.44-.65 6.26-1.77L7.5 8.02v8.73H5.6V6.5h2.38l10.9 14.02A11.96 11.96 0 0 0 24 12c0-6.63-5.37-12-12-12Zm4.53 6.5h1.88v8.3l-1.88-2.42V6.5Z" />
  </svg>
)

const TypeScriptIcon = (props: IconProps) => (
  <svg {...base} fill="currentColor" {...props}>
    <path d="M1.5 1.5h21v21h-21v-21Zm11.72 16.6c.63 1.2 1.85 1.9 3.5 1.9 2.1 0 3.6-1.1 3.6-2.98 0-1.72-1-2.5-2.75-3.25l-.52-.22c-.9-.38-1.28-.64-1.28-1.26 0-.5.38-.9 1-.9.6 0 .98.26 1.33.9l1.63-1.05c-.7-1.2-1.65-1.67-2.96-1.67-1.85 0-3.04 1.18-3.04 2.74 0 1.68.99 2.48 2.47 3.11l.52.23c.96.42 1.53.68 1.53 1.4 0 .58-.54 1-1.4 1-1 0-1.58-.53-2.02-1.25l-1.7 1.3ZM11.4 9.28H4.7v1.72h2.34v6.9h1.99V11h2.37V9.28Z" />
  </svg>
)

const NodeIcon = (props: IconProps) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" {...props}>
    <path d="M12 1.8 2.6 7.2v9.6l9.4 5.4 9.4-5.4V7.2L12 1.8Z" />
    <path d="M9.2 9.4v5.3c0 .8-.5 1.2-1.3 1.2s-1.3-.4-1.3-1.2" strokeLinecap="round" />
    <path
      d="M17.4 11.1c0-.9-.7-1.4-2-1.4s-2 .5-2 1.3c0 2 4.2.9 4.2 2.9 0 .9-.8 1.4-2.2 1.4s-2.2-.5-2.2-1.5"
      strokeLinecap="round"
    />
  </svg>
)

const PostgresIcon = (props: IconProps) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.2" {...props}>
    <path d="M17.6 3.3c-1.5-.5-3.4-.6-5.6-.6s-4.1.1-5.6.6C4.4 4 3.3 5.6 3.3 8.4c0 2.2.5 5 1.5 7.6 1 2.7 2.2 4.3 3.4 4.3.7 0 1.1-.5 1.6-1.1.4-.5.7-.8 1.1-.8h.2c.4 0 .7.3 1.1.8.5.6.9 1.1 1.6 1.1 1.2 0 2.4-1.6 3.4-4.3 1-2.6 1.5-5.4 1.5-7.6 0-2.8-1.1-4.4-2.1-5.1Z" />
    <path d="M12 8.6v6.6M9.2 7.6c.6-.4 1.5-.6 2.8-.6s2.2.2 2.8.6" strokeLinecap="round" />
  </svg>
)

const MongoIcon = (props: IconProps) => (
  <svg {...base} fill="currentColor" {...props}>
    <path d="M12 1.5c1.9 3.4 5.6 5.4 5.6 10.2 0 3.6-2.3 6.6-5 7.6l-.3 3.2h-.6l-.3-3.2c-2.7-1-5-4-5-7.6C6.4 6.9 10.1 4.9 12 1.5Zm0 3.4v13.8c1.7-.9 3.1-3.2 3.1-6.1 0-3.2-1.8-5-3.1-7.7Z" />
  </svg>
)

const ReactNativeIcon = (props: IconProps) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.1" {...props}>
    <rect x="7.4" y="1.6" width="9.2" height="20.8" rx="1.8" />
    <ellipse cx="12" cy="12" rx="6.6" ry="2.6" />
    <ellipse cx="12" cy="12" rx="6.6" ry="2.6" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="6.6" ry="2.6" transform="rotate(120 12 12)" />
    <circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none" />
  </svg>
)

const KotlinIcon = (props: IconProps) => (
  <svg {...base} fill="currentColor" {...props}>
    <path d="M2.4 2.4h19.2L12 12l9.6 9.6H2.4V2.4Zm2 2v15.2h12.8L9.2 12l7.8-7.6H4.4Z" />
    <path d="M21.6 2.4 12 12l9.6 9.6v-4.7L16.7 12l4.9-4.9V2.4Z" />
  </svg>
)

const SwiftIcon = (props: IconProps) => (
  <svg {...base} fill="currentColor" {...props}>
    <path d="M5.6 1.8h12.8c2.1 0 3.8 1.7 3.8 3.8v12.8c0 2.1-1.7 3.8-3.8 3.8H5.6c-2.1 0-3.8-1.7-3.8-3.8V5.6c0-2.1 1.7-3.8 3.8-3.8Zm11.7 15.6c.7-1.1.6-2.6.1-3.9-.9-2.5-3-4.7-5.1-6.4 1.3 2.1 2.4 4.4 2.4 6.9 0 .7-.1 1.4-.5 2-2.1-1.3-4-3-5.6-4.9 1.4 2.4 3.3 4.6 5.6 6.3-1.9.6-4 .3-5.8-.6 1.8 1.7 4.4 2.5 6.8 2 1 0 2-.4 2.7-1.2-.1-.1-.4-.2-.6-.2Z" />
  </svg>
)

const FigmaIcon = (props: IconProps) => (
  <svg {...base} fill="none" stroke="currentColor" strokeWidth="1.3" {...props}>
    <path d="M8.5 1.9h3.5v5.4H8.5a2.7 2.7 0 1 1 0-5.4Z" />
    <path d="M12 1.9h3.5a2.7 2.7 0 0 1 0 5.4H12V1.9Z" />
    <path d="M8.5 7.3H12v5.4H8.5a2.7 2.7 0 1 1 0-5.4Z" />
    <path d="M8.5 12.7H12v2.7a2.7 2.7 0 1 1-3.5-2.7Z" />
    <circle cx="15.5" cy="10" r="2.7" />
  </svg>
)

const VitestIcon = (props: IconProps) => (
  <svg {...base} fill="currentColor" {...props}>
    <path d="M12 1.6 22.7 6 12 22.4 1.3 6 12 1.6Zm0 2.6L4.6 7.2 12 18.6l7.4-11.4L12 4.2Z" />
    <path d="M12 7.4 15.4 9 12 14.6 8.6 9 12 7.4Z" />
  </svg>
)

const TailwindIcon = (props: IconProps) => (
  <svg {...base} fill="currentColor" {...props}>
    <path d="M12 6.3c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8 .91.23 1.57.89 2.29 1.63C13.66 12.1 15 13.5 18 13.5c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.91-.23-1.57-.89-2.29-1.63C16.34 7.7 15 6.3 12 6.3ZM6 13.5c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.91.23 1.57.89 2.29 1.63C7.66 19.3 9 20.7 12 20.7c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.91-.23-1.57-.89-2.29-1.63C10.34 14.9 9 13.5 6 13.5Z" />
  </svg>
)

/** Mapa id → komponenta. Id-ovi odgovaraju `TECH_ITEMS` u `tech.constants.ts`. */
export const TECH_ICONS = {
  react: ReactIcon,
  next: NextIcon,
  typescript: TypeScriptIcon,
  node: NodeIcon,
  postgres: PostgresIcon,
  mongo: MongoIcon,
  reactNative: ReactNativeIcon,
  kotlin: KotlinIcon,
  swift: SwiftIcon,
  figma: FigmaIcon,
  vitest: VitestIcon,
  tailwind: TailwindIcon,
} as const

export type TechIconId = keyof typeof TECH_ICONS
