import type { SVGProps } from 'react'

import { cn } from '@app/ui'


type SpiralMarkProps = SVGProps<SVGSVGElement> & {
  /** Uključuje petlju iscrtavanja (crta → drži → briše). Za statične upotrebe ostaviti false. */
  animated?: boolean
}

/**
 * Brend marka CloudSheep-a — oblak sa uvijenim pramenom vune (spirala).
 * Boja se nasleđuje preko `currentColor`, pa isti SVG radi na svetloj,
 * tamnoj i inverznoj podlozi. Uz `animated` sam se iscrtava u petlji.
 */
export const SpiralMark = ({ animated = false, className, ...props }: SpiralMarkProps) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    aria-hidden
    className={cn(animated && 'spiral-draw', className)}
    {...props}
  >
    {/* Oblak */}
    <path
      pathLength={1}
      d="M34 37 H16 A11 11 0 1 1 24.4 19 A8.5 8.5 0 0 1 39.5 25.2 A6 6 0 0 1 34 37 Z"
      stroke="currentColor"
      strokeWidth={2.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Pramen vune — unutrašnja spirala */}
    <path
      pathLength={1}
      d="M25.5 28.5 A4 4 0 1 1 21 24.6"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
    />
    <path
      pathLength={1}
      d="M28.4 29.6 A7 7 0 1 1 17.6 22.6"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
    />
    {/* Oko / akcenat */}
    <ellipse
      className="spiral-eye"
      cx={27.5}
      cy={21}
      rx={1.9}
      ry={1.3}
      fill="currentColor"
      transform="rotate(12 27.5 21)"
    />
  </svg>
)
