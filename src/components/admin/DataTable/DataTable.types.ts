import type { ReactNode } from 'react'

export interface DataColumn<Row> {
  key: string
  header: string
  cell: (row: Row) => ReactNode
  /** Kolona koja se skriva na telefonu (sekundarni podaci). */
  wide?: boolean
  align?: 'left' | 'right'
}

export interface DataTableProps<Row> {
  rows: Row[]
  columns: DataColumn<Row>[]
  rowKey: (row: Row) => string
  /** Tekst kad nema redova. */
  empty: string
  /** Opis tabele za čitač ekrana. */
  caption: string
  /** Istaknut red (nepročitana poruka). */
  highlight?: (row: Row) => boolean
}
