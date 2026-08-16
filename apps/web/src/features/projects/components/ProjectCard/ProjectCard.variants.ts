import { cva } from 'class-variance-authority'

/** Elevacija umesto ivice (docs/22 §3): široka bleda senka, veliki radijus. */
export const projectCardVariants = cva(
  'group flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-12px_rgb(0_0_0/0.14)] ring-1 ring-border/50 transition-shadow duration-300 ring-inset hover:shadow-[0_2px_6px_rgb(0_0_0/0.06),0_28px_56px_-16px_rgb(0_0_0/0.22)]',
)

export const projectMediaVariants = cva(
  'flex aspect-[16/10] items-center justify-center bg-background text-faint',
)

export const projectBodyVariants = cva('flex flex-1 flex-col gap-2 p-6')

export const projectTitleVariants = cva(
  'font-heading text-xl font-semibold tracking-tight text-foreground',
)

export const projectYearVariants = cva('font-mono text-xs text-faint')

export const projectCatVariants = cva('font-mono text-[11.5px] tracking-wide text-primary')

export const projectDescVariants = cva('flex-1 text-[14.5px] leading-relaxed text-muted-foreground')
