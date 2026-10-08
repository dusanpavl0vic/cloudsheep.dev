'use client'

import { Root, Segment } from './SegmentedControl.styles'
import type { SegmentedControlProps } from './SegmentedControl.types'

/** Izbor jedne od nekoliko opcija u traci (jezik, uređaj). Controlled: `value` + `onChange`. */
const SegmentedControl = <V extends string>({ options, value, onChange, label, mono = false, className }: SegmentedControlProps<V>) => (
  <Root role="radiogroup" aria-label={label} className={className}>
    {options.map((option) => (
      <Segment
        key={option.value}
        type="button"
        role="radio"
        aria-checked={option.value === value}
        aria-label={option.ariaLabel}
        $active={option.value === value}
        $mono={mono}
        onClick={() => {
          onChange(option.value)
        }}
      >
        {option.label}
      </Segment>
    ))}
  </Root>
)

export default SegmentedControl
