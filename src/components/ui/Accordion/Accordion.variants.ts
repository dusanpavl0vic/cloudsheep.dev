import { cva } from 'class-variance-authority'

export const accordionItemVariants = cva('group border-t border-border last:border-b')

export const accordionTriggerVariants = cva(
  'flex w-full cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-base font-medium text-foreground transition-colors hover:text-primary [&::-webkit-details-marker]:hidden',
)

export const accordionIconVariants = cva(
  'shrink-0 text-2xl leading-none font-light text-muted-foreground transition-transform duration-200 group-open:rotate-45',
)

export const accordionContentVariants = cva('pb-6 text-sm leading-relaxed text-muted-foreground')
