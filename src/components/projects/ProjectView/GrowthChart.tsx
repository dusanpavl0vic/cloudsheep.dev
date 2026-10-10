'use client'

import { useRef } from 'react'

import { sparkGeometry } from '@/helpers/chart'
import { useInView } from '@/hooks/useInView'

import { Area, Axis, Dot, FillBottom, FillTop, GridLine, Line, Svg } from './GrowthChart.styles'
import { SPARK_BOX } from './ProjectView.yak'

interface GrowthChartProps {
  data: number[]
  /** Oznake ose: „Launch", „M1"… — iste dužine kao `data`. */
  axis: string[]
  /** Rečenica za čitač ekrana („Rast sa 120 na 4.800 za 6 meseci."). */
  summary: string
}

/** Linija aktivnih korisnika posle lansiranja; crta se kad uđe u ekran. */
const GrowthChart = ({ data, axis, summary }: GrowthChartProps) => {
  const ref = useRef<HTMLDivElement>(null)
  const drawn = useInView(ref)
  const geometry = sparkGeometry(data, SPARK_BOX)
  if (!geometry) return null

  return (
    <div ref={ref}>
      <Svg viewBox={`0 0 ${String(SPARK_BOX.width)} ${String(SPARK_BOX.height)}`} role="img" aria-label={summary}>
        <defs>
          <linearGradient id="growth-fill" x1="0" x2="0" y1="0" y2="1">
            <FillTop offset="0" />
            <FillBottom offset="1" />
          </linearGradient>
        </defs>
        {geometry.grid.map((y) => (
          <GridLine key={y} x1={SPARK_BOX.padding} x2={SPARK_BOX.width - SPARK_BOX.padding} y1={y} y2={y} />
        ))}
        <Area d={geometry.area} fill="url(#growth-fill)" $drawn={drawn} />
        <Line d={geometry.line} $drawn={drawn} style={{ strokeDasharray: geometry.length, strokeDashoffset: geometry.length }} />
        <Dot cx={geometry.last.x} cy={geometry.last.y} r={7} $drawn={drawn} />
      </Svg>
      <Axis aria-hidden="true">
        {axis.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </Axis>
    </div>
  )
}

export default GrowthChart
