
import { TechTile } from '@/components/TechTile'
import { TECH_ITEMS } from '@/features/landing/tech.constants'
import { chunk } from '@app/utils'

import {
  techGridLinesVariants,
  techGridListVariants,
  techGridRowVariants,
  techGridWrapVariants,
} from './TechGrid.variants'

/** Osam po redu — dovoljno gusto da mreža ima ritam, dovoljno retko da pločice dišu. */
const PER_ROW = 8

/**
 * Mreža logotipa tehnologija.
 *
 * `chunk` iz `@app/utils` deli listu u redove — funkcija već postoji i testirana je,
 * nema razloga pisati petlju ovde.
 *
 * Lista je jedna `<ul>` sa vidljivim stavkama; linije mreže su dekoracija i `aria-hidden`.
 */
export function TechGrid() {
  const rows = chunk(TECH_ITEMS, PER_ROW)

  return (
    <div className={techGridWrapVariants()}>
      <div aria-hidden className={techGridLinesVariants()} />

      <ul className={techGridListVariants()}>
        {rows.map((row, index) => (
          <li key={row[0]?.id ?? index}>
            <ul className={techGridRowVariants({ offset: index % 2 === 1 })}>
              {row.map((item) => (
                <li key={item.id}>
                  <TechTile label={item.label} icon={item.icon} size="lg" interactive />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  )
}
