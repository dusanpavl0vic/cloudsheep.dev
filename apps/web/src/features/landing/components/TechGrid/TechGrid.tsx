import { TechTile } from '@/components/TechTile'
import { TECH_ITEMS, type TechItem } from '@/lib/tech'

import {
  techGridItemVariants,
  techGridLinesVariants,
  techGridListVariants,
  techGridRowVariants,
  techGridWrapVariants,
} from './TechGrid.variants'

/**
 * Redovi nejednake dužine — otud asimetrija. Zbir mora pokriti `TECH_ITEMS`;
 * ostatak preko zbira ide u poslednji red.
 */
const ROW_SIZES = [5, 6, 5] as const

const LIFTS = ['none', 'up', 'down', 'up', 'none', 'down'] as const
const SIZES = ['md', 'lg', 'md', 'lg', 'md'] as const

interface Row {
  items: TechItem[]
  /** Redni broj prve stavke u celoj listi — određuje veličinu i pomak. */
  offset: number
}

/**
 * Deli listu na redove zadatih dužina; višak ide u poslednji.
 *
 * Pomak se računa **ovde**, ne u petlji tokom rendera: menjanje promenljive dok se
 * renderuje je greška koju `react-hooks/immutability` s pravom odbija.
 */
function splitRows(items: readonly TechItem[]): Row[] {
  const rows: Row[] = []
  let cursor = 0

  for (const [index, size] of ROW_SIZES.entries()) {
    const isLast = index === ROW_SIZES.length - 1
    rows.push({ items: items.slice(cursor, isLast ? undefined : cursor + size), offset: cursor })
    cursor += size
  }

  return rows.filter((row) => row.items.length > 0)
}

/**
 * Mreža logotipa tehnologija.
 *
 * Linije mreže su dekoracija i `aria-hidden`; lista je jedna `<ul>` sa vidljivim stavkama.
 */
export function TechGrid() {
  const rows = splitRows(TECH_ITEMS)

  return (
    <div className={techGridWrapVariants()}>
      <div aria-hidden className={techGridLinesVariants()} />

      <ul className={techGridListVariants()}>
        {rows.map((row, rowIndex) => (
          <li key={row.items[0]?.id ?? rowIndex}>
            <ul className={techGridRowVariants()}>
              {row.items.map((item, itemIndex) => {
                const absolute = row.offset + itemIndex

                return (
                  <li
                    key={item.id}
                    className={techGridItemVariants({
                      lift: LIFTS[absolute % LIFTS.length] ?? 'none',
                    })}
                  >
                    <TechTile
                      label={item.label}
                      icon={item.icon}
                      size={SIZES[absolute % SIZES.length] ?? 'md'}
                      interactive
                    />
                  </li>
                )
              })}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
