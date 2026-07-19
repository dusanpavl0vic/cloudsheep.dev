import { cva } from 'class-variance-authority'

export const cardVariants = cva('rounded-xl border bg-card text-card-foreground shadow-sm')

export const cardHeaderVariants = cva('flex flex-col gap-1.5 p-6')

export const cardTitleVariants = cva('text-lg leading-none font-semibold')

export const cardContentVariants = cva('p-6 pt-0')
