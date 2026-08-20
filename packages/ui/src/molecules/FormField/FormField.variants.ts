import { cva } from 'class-variance-authority'

export const formFieldVariants = cva('flex flex-col gap-1.5')

export const formFieldDescriptionVariants = cva('text-[13px] text-muted-foreground')

export const formFieldErrorVariants = cva('text-sm text-destructive')
