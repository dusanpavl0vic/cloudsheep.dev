'use client'

import { useId } from 'react'

import { MASK_PREFIX, RAYS } from './ThemeToggle.constants'
import { Body, MaskCircle, Rays, Root, Svg } from './ThemeToggle.styles'
import type { ThemeToggleProps } from './ThemeToggle.types'

/** Sunce koje se maskom pretvara u mesec (dizajn). Controlled: stanje i akcija dolaze spolja. */
const ThemeToggle = ({ isDark, onToggle, label, className }: ThemeToggleProps) => {
  const maskId = `${MASK_PREFIX}-${useId()}`

  return (
    <Root
      type="button"
      aria-label={label}
      aria-pressed={isDark}
      title={label}
      $dark={isDark}
      className={className}
      onClick={(event) => {
        onToggle(event.currentTarget)
      }}
    >
      <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" aria-hidden="true" $dark={isDark}>
        <defs>
          <mask id={maskId}>
            <rect x={-4} y={-4} width={32} height={32} fill="#fff" />
            <MaskCircle cx={isDark ? 17 : 30} cy={isDark ? 7 : -6} r={9} fill="#000" $dark={isDark} />
          </mask>
        </defs>
        <Body cx={12} cy={12} r={isDark ? 9 : 5} fill="currentColor" mask={`url(#${maskId})`} $dark={isDark} />
        <Rays stroke="currentColor" strokeWidth={2} strokeLinecap="round" $dark={isDark}>
          {RAYS.map(([x1, y1, x2, y2]) => (
            <line key={`${String(x1)}-${String(y1)}`} x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </Rays>
      </Svg>
    </Root>
  )
}

export default ThemeToggle
