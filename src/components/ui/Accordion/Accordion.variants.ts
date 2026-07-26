import { cva } from 'class-variance-authority'

export const accordionItemVariants = cva('group border-b border-border')

export const accordionTriggerVariants = cva(
  'flex w-full cursor-pointer list-none items-center justify-between gap-4 py-5 text-left text-[17px] font-semibold text-foreground transition-colors hover:text-primary [&::-webkit-details-marker]:hidden',
)

export const accordionIconVariants = cva(
  'shrink-0 font-heading text-2xl leading-none text-primary transition-transform duration-300 group-open:rotate-45',
)

export const accordionContentVariants = cva(
  'dropdown-content pb-5 text-[15.5px] leading-relaxed text-muted-foreground',
)
