import { cva } from 'class-variance-authority'

export const heroVariants = cva(
  'relative flex min-h-[calc(100svh-72px)] w-full flex-col items-center justify-center overflow-hidden bg-background px-5 py-20 text-center',
)

export const heroCloudsVariants = cva('cs-clouds pointer-events-none absolute inset-0')

export const heroSpiralVariants = cva(
  'pointer-events-none absolute top-1/2 left-1/2 z-0 h-auto w-[min(600px,88vw)] -translate-x-1/2 -translate-y-[56%] text-primary',
)

export const heroMonoVariants = cva(
  'relative z-10 mb-2.5 font-mono text-[clamp(1.05rem,1.9vw,1.4rem)] font-semibold tracking-wide text-foreground',
)

export const heroTitleVariants = cva(
  'relative z-10 m-0 font-heading text-[clamp(2.9rem,8.5vw,6.8rem)] leading-[0.94] font-bold tracking-[-0.05em] text-balance text-display',
)

export const heroTextVariants = cva(
  'relative z-10 mt-7 max-w-[600px] text-[clamp(1.05rem,1.6vw,1.3rem)] leading-relaxed text-pretty text-muted-foreground',
)

export const heroTerminalVariants = cva(
  'relative z-10 mt-6 inline-flex items-center gap-2 font-mono text-[clamp(12px,1.4vw,14px)] text-muted-foreground',
)

export const heroCtaVariants = cva(
  'relative z-10 mt-7 flex flex-wrap items-center justify-center gap-3.5',
)

export const heroScrollVariants = cva(
  'absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1.5 font-mono text-[11px] tracking-[0.16em] text-faint',
)
