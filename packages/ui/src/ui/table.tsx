import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'

import {
  tableCellVariants,
  tableHeadVariants,
  tableRowVariants,
  tableVariants,
  tableWrapperVariants,
} from './table.variants'
import { cn } from '../lib/cn'

/**
 * Tanki omotači nad HTML tabelom — bez sortiranja, paginacije i konfiguracije kolona.
 *
 * To NIJE `DataTable`. Admin liste u ovom projektu broje desetine redova; sortiranje i
 * paginacija nad dvadeset redova su rad koji niko ne traži. Kad neka lista pređe 100
 * redova, `docs/07 §5` traži virtualizaciju, i tek tada ima smisla graditi organizam.
 *
 * `<table>` je zadržan kao element jer nosi semantiku koju `div`-ovi nemaju: screen reader
 * čita zaglavlje kolone uz svaku ćeliju.
 */
export const Table = ({ className, children, ...props }: HTMLAttributes<HTMLTableElement>) => (
  <div className={tableWrapperVariants()}>
    <table className={cn(tableVariants(), className)} {...props}>
      {children}
    </table>
  </div>
)

export const TableHeader = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <thead className={className} {...props} />
)

export const TableBody = ({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) => (
  <tbody className={className} {...props} />
)

export const TableRow = ({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) => (
  <tr className={cn(tableRowVariants(), className)} {...props} />
)

export const TableHead = ({ className, ...props }: ThHTMLAttributes<HTMLTableCellElement>) => (
  <th scope="col" className={cn(tableHeadVariants(), className)} {...props} />
)

export const TableCell = ({ className, ...props }: TdHTMLAttributes<HTMLTableCellElement>) => (
  <td className={cn(tableCellVariants(), className)} {...props} />
)
