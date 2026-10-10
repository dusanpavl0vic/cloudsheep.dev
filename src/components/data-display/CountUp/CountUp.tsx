'use client'

import { useRef } from 'react'

import { useCountUp } from '@/hooks/useCountUp'
import { useInView } from '@/hooks/useInView'

import { NUMBER_IN_TEXT } from './CountUp.constants'
import { Root, Suffix } from './CountUp.styles'
import type { CountUpProps } from './CountUp.types'

const parse = (value: number | string, decimals: number) => {
  if (typeof value === 'number') return { prefix: '', target: value, rest: '', decimals, grouped: false }
  const match = NUMBER_IN_TEXT.exec(value)
  if (!match?.[2]) return null
  return {
    prefix: match[1] ?? '',
    target: Number.parseFloat(match[2].replace(/,/g, '')),
    rest: match[3] ?? '',
    decimals: (match[2].split('.')[1] ?? '').length,
    grouped: match[2].includes(','),
  }
}

/** Broj koji naraste kad uđe u ekran. Na serveru i bez JS-a odmah prikazuje konačnu vrednost. */
const CountUp = ({ value, decimals = 0, suffix, durationMs = 1900, className }: CountUpProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const parsed = parse(value, decimals)
  const current = useCountUp(parsed?.target ?? 0, useInView(ref, 0.4), durationMs)

  if (!parsed) return <Root className={className}>{value}</Root>

  const fixed = current.toFixed(parsed.decimals)
  const shown = parsed.grouped
    ? Number(fixed).toLocaleString('en-US', { minimumFractionDigits: parsed.decimals, maximumFractionDigits: parsed.decimals })
    : fixed

  return (
    <Root ref={ref} className={className}>
      {parsed.prefix}
      {shown}
      {parsed.rest}
      {suffix && <Suffix>{suffix}</Suffix>}
    </Root>
  )
}

export default CountUp
