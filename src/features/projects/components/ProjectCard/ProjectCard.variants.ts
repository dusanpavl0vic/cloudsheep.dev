import { cva } from 'class-variance-authority'

export const projectCardVariants = cva(
  'group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-inverse/15',
)

export const projectMediaVariants = cva(
  'flex aspect-[16/10] items-center justify-center border-b border-border bg-background text-faint',
)

export const projectBodyVariants = cva('flex flex-1 flex-col gap-2 p-6')

export const projectTitleVariants = cva(
  'font-heading text-xl font-semibold tracking-tight text-foreground',
)

export const projectYearVariants = cva('font-mono text-xs text-faint')

export const projectCatVariants = cva('font-mono text-[11.5px] tracking-wide text-primary')

export const projectDescVariants = cva('flex-1 text-[14.5px] leading-relaxed text-muted-foreground')
