export interface SparkBox {
  width: number
  height: number
  padding: number
  /** Prostor iznad najviše tačke (dizajn: 20). */
  headroom: number
}

export interface SparkGeometry {
  line: string
  area: string
  last: { x: number; y: number }
  /** Dužina linije — za `stroke-dasharray` animaciju crtanja. */
  length: number
  /** Y koordinate isprekidanih linija mreže. */
  grid: number[]
}

/** Linija rasta (dizajn `Spark`): tačke ravnomerno po X, Y skaliran na maksimum. */
export const sparkGeometry = (data: readonly number[], box: SparkBox, gridLines = 4): SparkGeometry | null => {
  if (data.length < 2) return null
  const { width, height, padding, headroom } = box
  const max = Math.max(...data, 1)
  const plot = height - 2 * padding - headroom
  const points = data.map((value, index) => ({
    x: padding + (index * (width - 2 * padding)) / (data.length - 1),
    y: height - padding - (value / max) * plot,
  }))

  let length = 0
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1]
    const b = points[i]
    if (a && b) length += Math.hypot(b.x - a.x, b.y - a.y)
  }

  const line = `M${points.map((p) => `${String(p.x)},${String(p.y)}`).join(' L')}`
  const last = points[points.length - 1] ?? { x: 0, y: 0 }
  const area = `${line} L${String(last.x)},${String(height - padding)} L${String(padding)},${String(height - padding)} Z`
  const grid = Array.from({ length: gridLines }, (_, i) => padding + headroom + (i * plot) / (gridLines - 1))

  return { line, area, last, length, grid }
}
