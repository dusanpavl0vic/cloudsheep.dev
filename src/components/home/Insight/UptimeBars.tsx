'use client'

import { useRef } from 'react'

import { useInView } from '@/hooks/useInView'

import { UPTIME_DAYS, UPTIME_DEGRADED } from './Insight.constants'
import { Bar, Bars, Legend, Root } from './UptimeBars.styles'

interface UptimeBarsProps {
  label: string
  period: string
  /** Opis za čitač ekrana („svi sistemi rade"). */
  summary: string
}

/** 90 stubića uptime-a koji narastu kad uđu u ekran. Bez JS-a su odmah pune visine. */
const UptimeBars = ({ label, period, summary }: UptimeBarsProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref)

  return (
    <Root ref={ref}>
      <Legend>
        <span>{label}</span>
        <span>{period}</span>
      </Legend>
      <Bars role="img" aria-label={`${label}, ${period}: ${summary}`}>
        {UPTIME_DAYS.map((height, index) => (
          <Bar key={index} $index={index} $height={height} $grown={inView} $degraded={height < UPTIME_DEGRADED} />
        ))}
      </Bars>
    </Root>
  )
}

export default UptimeBars
