import { cva } from 'class-variance-authority'

export const siteFooterVariants = cva('w-full bg-inverse text-inverse-foreground')

export const footerGridVariants = cva(
  'grid grid-cols-1 gap-10 py-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]',
)

export const footerGroupTitleVariants = cva(
  'font-mono text-xs tracking-widest uppercase text-inverse-muted',
)

export const footerLinkVariants = cva(
  'text-sm text-inverse-foreground/80 transition-colors hover:text-inverse-foreground',
)

export const footerTextVariants = cva('max-w-[280px] text-sm leading-relaxed text-inverse-muted')

export const footerBottomVariants = cva(
  'flex flex-col items-center justify-between gap-3 border-t border-inverse-border py-6 sm:flex-row',
)

export const footerBottomTextVariants = cva('font-mono text-xs tracking-wide text-inverse-muted')
