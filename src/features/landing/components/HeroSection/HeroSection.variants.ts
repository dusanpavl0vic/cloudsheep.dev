import { cva } from 'class-variance-authority'

export const heroVariants = cva('relative w-full overflow-hidden py-24 md:py-32')

export const heroWatermarkVariants = cva(
  'pointer-events-none absolute -top-10 -right-32 hidden h-[560px] w-auto text-primary/10 lg:block',
)

export const heroTitleVariants = cva(
  'font-heading text-6xl leading-[0.95] font-bold tracking-tight text-primary sm:text-8xl lg:text-[176px]',
)

export const heroTerminalVariants = cva(
  'inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 font-mono text-xs text-muted-foreground',
)

export const heroTerminalCaretVariants = cva('inline-block h-4 w-[7px] animate-pulse bg-primary')

export const heroTextVariants = cva('max-w-[560px] text-lg leading-relaxed text-muted-foreground')

export const heroScrollVariants = cva(
  'pt-10 font-mono text-xs tracking-wide lowercase text-muted-foreground',
)
