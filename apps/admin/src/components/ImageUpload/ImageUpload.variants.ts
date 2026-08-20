import { cva } from 'class-variance-authority'

export const dropzoneVariants = cva(
  'flex items-center gap-4 rounded-xl border border-dashed border-border p-4 transition-colors',
  {
    variants: {
      state: {
        idle: '',
        busy: 'opacity-60',
        error: 'border-destructive/50 bg-destructive/5',
      },
    },
    defaultVariants: { state: 'idle' },
  },
)

export const previewVariants = cva(
  'flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-muted',
)

export const previewImageVariants = cva('size-full object-contain p-1.5')
