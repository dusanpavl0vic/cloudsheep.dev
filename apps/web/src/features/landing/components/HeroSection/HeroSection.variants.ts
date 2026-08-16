import { cva } from 'class-variance-authority'

export const heroVariants = cva(
  'relative flex min-h-[calc(100svh-72px)] w-full flex-col items-center justify-center overflow-hidden bg-background px-5 py-20 text-center',
)

/**
 * Nosač perspektive. `perspective` mora biti na roditelju, ne na samoj mreži —
 * inače se `rotateX` primenjuje ravno i dubine nema.
 */
export const heroGridStageVariants = cva(
  'pointer-events-none absolute inset-0 [perspective:640px] [perspective-origin:50%_0%]',
)

/**
 * Sama mreža. Prelazi donju ivicu (`-bottom-1/3`) da linije ne bi nestale na dnu ekrana
 * kad ih rotacija „položi".
 */
export const heroGridVariants = cva(
  'cs-grid absolute inset-x-[-30%] top-[18%] -bottom-1/3 [transform:rotateX(64deg)] [transform-origin:50%_0%] text-border-strong',
)

/** Upaljeni sloj — ista mreža u boji akcenta, vidljiva samo kroz masku oko kursora. */
export const heroGridLitVariants = cva(
  'cs-grid absolute inset-x-[-30%] top-[18%] -bottom-1/3 [transform:rotateX(64deg)] [transform-origin:50%_0%] text-primary',
)

/** Sjaj na liniji horizonta — čini da mreža „izlazi" iz svetla, umesto da se seče. */
export const heroHorizonVariants = cva(
  'pointer-events-none absolute inset-x-0 top-[18%] h-40 -translate-y-1/2 bg-[radial-gradient(ellipse_50%_100%_at_50%_50%,var(--color-primary)_0%,transparent_70%)] opacity-[0.14] blur-2xl',
)

export const heroSpiralVariants = cva(
  'spiral-hero pointer-events-none absolute top-1/2 left-1/2 z-0 h-auto w-[min(600px,88vw)] -translate-x-1/2 -translate-y-[56%] text-primary',
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

/**
 * SCROLL je sada dugme, pa mora imati vidljiv fokus i dodirnu površinu —
 * `-mx-3 px-3 py-2` proširuje pogodak bez pomeranja rasporeda.
 */
export const heroScrollVariants = cva(
  'absolute bottom-7 left-1/2 z-10 -mx-3 flex -translate-x-1/2 cursor-pointer flex-col items-center gap-1.5 rounded-lg px-3 py-2 font-mono text-[11px] tracking-[0.16em] text-faint transition-colors duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none',
)

/** Strelica poskakuje sama; tekst miruje da natpis ostane čitljiv. */
export const heroScrollArrowVariants = cva('cs-scroll-hint text-[13px] leading-none')
