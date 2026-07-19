import { cva } from 'class-variance-authority'

export const contactBannerVariants = cva(
  'relative flex flex-col items-center gap-6 overflow-hidden rounded-2xl bg-inverse px-8 py-20 text-center',
)

export const contactWatermarkVariants = cva(
  'pointer-events-none absolute -right-16 -bottom-16 hidden h-[300px] w-auto text-inverse-foreground/10 md:block',
)

export const contactTitleVariants = cva(
  'font-heading text-4xl leading-tight font-bold text-balance text-inverse-foreground md:text-5xl',
)

export const contactEmailVariants = cva(
  'font-mono text-sm text-inverse-muted underline-offset-4 transition-colors hover:text-inverse-foreground hover:underline',
)
