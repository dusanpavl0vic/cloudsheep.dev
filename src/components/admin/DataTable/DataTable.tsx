import { Caption, Cell, Empty, Head, Row, Table, Wrap } from './DataTable.styles'
import type { DataTableProps } from './DataTable.types'

/** Tabela admin liste: kolone su konfiguracija, ćelija je funkcija reda. */
const DataTable = <T,>({ rows, columns, rowKey, empty, caption, highlight }: DataTableProps<T>) => (
  <Wrap>
    {rows.length === 0 ? (
      <Empty>{empty}</Empty>
    ) : (
      <Table>
        <Caption>{caption}</Caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <Head key={column.key} scope="col" $wide={Boolean(column.wide)} $right={column.align === 'right'}>
                {column.header}
              </Head>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <Row key={rowKey(row)} $highlight={Boolean(highlight?.(row))}>
              {columns.map((column) => (
                <Cell key={column.key} $wide={Boolean(column.wide)} $right={column.align === 'right'}>
                  {column.cell(row)}
                </Cell>
              ))}
            </Row>
          ))}
        </tbody>
      </Table>
    )}
  </Wrap>
)

export default DataTable
