import type { SectionSpacing } from './Section.types'

/** Vertikalni razmak sekcija iz dizajna (fluidan). */
export const SECTION_PADDING: Record<SectionSpacing, string> = {
  default: 'clamp(60px, 8vw, 110px)',
  loose: 'clamp(80px, 10vw, 130px)',
  tight: 'clamp(40px, 6vw, 80px)',
}

export const SECTION_WIDTH = 1200
