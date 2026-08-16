import { cva } from 'class-variance-authority'

export const siteHeaderVariants = cva(
  'sticky top-0 z-60 w-full border-b border-border bg-background/85 backdrop-blur-md',
)

export const siteHeaderInnerVariants = cva('flex h-[72px] items-center gap-7')

export const siteNavVariants = cva('ml-auto hidden items-center gap-7 md:flex')

export const siteNavLinkVariants = cva(
  'nav-underline text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground',
)
