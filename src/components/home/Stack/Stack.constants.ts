import type { Technology } from '@/types/technology'

/** Dužine redova (dizajn); poslednji red uzima ostatak. */
const ROW_LENGTHS = [5, 6] as const
const LIFTS = [0, -14, 14, -14, 0, 14] as const

export const TILE = { big: 72, small: 58 } as const

export interface StackTile {
  tech: Technology
  size: number
  lift: number
}

/** Raspored pločica iz dizajna: svaka druga i četvrta u petorci je veća, visina talasa. */
export const stackRows = (technologies: readonly Technology[]): StackTile[][] => {
  const tiles = technologies.map((tech, index) => ({
    tech,
    size: index % 5 === 1 || index % 5 === 3 ? TILE.big : TILE.small,
    lift: LIFTS[index % LIFTS.length] ?? 0,
  }))
  const rows: StackTile[][] = []
  let start = 0
  for (const length of ROW_LENGTHS) {
    if (start >= tiles.length) break
    rows.push(tiles.slice(start, start + length))
    start += length
  }
  if (start < tiles.length) rows.push(tiles.slice(start))
  return rows
}
