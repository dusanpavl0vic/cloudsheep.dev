import { cva } from 'class-variance-authority'

import { glassVariants } from '../lib/surface.variants'

/** Omotač nosi horizontalno skrolovanje — tabela na telefonu inače širi celu stranicu. */
export const tableWrapperVariants = cva(
  [glassVariants({ radius: 'md' }), 'w-full overflow-x-auto'].join(' '),
)

export const tableVariants = cva('w-full border-collapse text-[15px]')

export const tableHeadVariants = cva(
  'border-b border-border px-4 py-3 text-start text-[13px] font-semibold text-muted-foreground',
)

export const tableRowVariants = cva('border-b border-border last:border-b-0 hover:bg-muted/40')

export const tableCellVariants = cva('px-4 py-3 align-middle')
