import { cva } from 'class-variance-authority'

export const siteFooterVariants = cva('relative w-full overflow-hidden bg-inverse text-inverse-foreground')

/** Dekorativna dot-grid tekstura na navy podlozi (boja iz tokena). */
export const footerDotGridVariants = cva('pointer-events-none absolute inset-0')

export const footerTopVariants = cva(
  'flex flex-col justify-between gap-10 border-b border-inverse-border pb-12 md:flex-row md:items-end',
)

export const footerHeadlineVariants = cva(
  'max-w-[15ch] font-heading text-4xl leading-[1.02] font-bold tracking-tight md:text-[54px]',
)

export const footerGridVariants = cva(
  'grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]',
)

export const footerGroupTitleVariants = cva(
  'mb-4 font-mono text-[11.5px] tracking-[0.1em] uppercase text-inverse-faint',
)

export const footerLinkVariants = cva(
  'text-[14.5px] text-inverse-muted transition-colors hover:text-inverse-foreground',
)

export const footerTextVariants = cva('max-w-[290px] text-[14.5px] leading-relaxed text-inverse-muted')

export const footerSocialVariants = cva(
  'inline-flex size-[42px] items-center justify-center rounded-xl border border-inverse-border text-inverse-muted transition-[transform,background-color,color,border-color] duration-200 hover:-translate-y-0.5 hover:border-primary hover:bg-primary hover:text-primary-foreground [&_svg]:size-[18px]',
)

export const footerBottomVariants = cva(
  'flex flex-col items-center justify-between gap-3 border-t border-inverse-border py-6 sm:flex-row',
)

export const footerBottomTextVariants = cva(
  'font-mono text-[11.5px] tracking-wide text-inverse-faint transition-colors hover:text-inverse-foreground',
)

/* --- Slim varijanta (podstranice) --- */
export const footerSlimRowVariants = cva(
  'flex flex-col items-center justify-between gap-4 py-7 sm:flex-row',
)
