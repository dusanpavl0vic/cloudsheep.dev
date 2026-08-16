import { cva } from 'class-variance-authority'

export const heroVariants = cva(
  'relative flex min-h-[calc(100svh-72px)] w-full flex-col items-center justify-center overflow-hidden bg-background px-5 py-20 text-center',
)

/** Statični ambijentalni sjaj — sloj koji se nikad ne pomera. */
export const heroAmbientVariants = cva('pointer-events-none absolute inset-0')

/**
 * Fina tačkasta tekstura preko cele sekcije (docs/22 §6).
 * Statična je — animiran uzorak je već dvaput pao na performansama.
 */
export const heroDotsVariants = cva(
  'pointer-events-none absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-[length:22px_22px] text-border-strong/40 [mask-image:radial-gradient(ellipse_75%_70%_at_50%_45%,transparent_35%,#000_100%)]',
)

/** Svetlo oko kursora. Jedini pokretan sloj, i to samo dok se miš pomera. */
export const heroCursorGlowVariants = cva(
  'pointer-events-none absolute inset-0 transition-opacity duration-500',
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

/**
 * Prigušeni nastavak naslova (docs/22 §1).
 * Dopuna, ne ključna informacija — rečenica mora imati smisla i bez njega.
 */
export const heroTitleMutedVariants = cva('text-faint')

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
