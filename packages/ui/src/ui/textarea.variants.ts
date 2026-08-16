import { cva } from 'class-variance-authority'

export const textareaVariants = cva(
  'flex min-h-[120px] w-full resize-y rounded-[10px] border border-input bg-background px-3.5 py-2.5 text-[15px] text-foreground transition-colors placeholder:text-faint focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:bg-destructive/5 aria-invalid:focus-visible:ring-destructive/30',
)
