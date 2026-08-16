import { cva } from 'class-variance-authority'

export const contactBannerVariants = cva(
  'relative flex flex-col items-center gap-3.5 overflow-hidden rounded-[24px] bg-inverse px-8 py-20 text-center',
)

export const contactMarkVariants = cva('relative mb-2 size-12 text-primary')

export const contactTitleVariants = cva(
  'relative font-heading text-4xl leading-tight font-bold tracking-tight text-balance text-inverse-foreground md:text-[52px]',
)

export const contactEmailVariants = cva(
  'relative font-mono text-[15px] text-inverse-primary transition-colors hover:brightness-110',
)
