import { cva } from 'class-variance-authority'

export const siteHeaderVariants = cva(
  'sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur',
)

export const siteHeaderInnerVariants = cva('flex h-16 items-center justify-between gap-6')

export const siteNavVariants = cva('hidden items-center gap-8 lg:flex')

export const siteNavLinkVariants = cva(
  'font-mono text-xs tracking-wide lowercase text-muted-foreground transition-colors hover:text-primary',
)
