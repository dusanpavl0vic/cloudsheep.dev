import { cva } from 'class-variance-authority'

export const workItemVariants = cva('grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-14')

export const workMediaVariants = cva(
  'group/media flex aspect-[16/10] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-card text-faint shadow-sm transition-shadow duration-300 hover:shadow-xl hover:shadow-inverse/15',
)

export const workBodyVariants = cva('flex flex-col gap-2')

export const workIndexVariants = cva('font-mono text-[13px] tracking-wide text-primary')

export const workTitleVariants = cva(
  'mt-1 font-heading text-[34px] leading-tight font-bold tracking-tight text-foreground',
)

export const workMetaVariants = cva('font-mono text-[12.5px] tracking-wide lowercase text-faint')

export const workTextVariants = cva('py-1 text-[16px] leading-relaxed text-muted-foreground')

export const workCaptionVariants = cva(
  'max-w-[70%] text-center font-mono text-xs tracking-wide lowercase',
)
