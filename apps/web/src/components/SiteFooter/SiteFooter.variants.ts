import { cva } from 'class-variance-authority'

/**
 * Svetli panel sa tačkastom teksturom (docs/22 §3, §6).
 *
 * Ranije je bio tamni navy blok. Pošto ContactSection iznad njega već nosi tamni CTA panel,
 * dva tamna bloka jedan do drugog su se slila u jedan — footer je gubio granicu.
 */
/**
 * Kraj stranice, ne druga površina.
 *
 * Staklo stoji na sloju ispod sadržaja i nosi masku koja ga gasi NAVIŠE — ista tehnika kao
 * header (`SiteHeader.variants.ts`), samo obrnuta. Gornja ivica footera zato ne postoji kao
 * linija nego kao prelaz od 160px.
 *
 * Maska se zaustavlja na 0.88, ne na punoj: footer naleže na donju ivicu okvira, a puna
 * jačina tu pravi stepenik prema razmaku oko okvira koji staklo nema.
 *
 * Dve ranije verzije su tu imale rez: prvo `bg-muted/55` (i druga boja i druga alfa od
 * okvira, pa vidljiva traka), pa hairline gradijent koji je granicu samo naglasio. Obe su
 * crtale liniju tamo gde linija ne treba da se vidi.
 */
export const siteFooterVariants = cva(
  [
    'relative isolate w-full overflow-hidden text-foreground',
    "before:pointer-events-none before:absolute before:inset-0 before:-z-10 before:bg-glass before:content-['']",
    'before:supports-[backdrop-filter]:backdrop-blur-glass before:supports-[backdrop-filter]:backdrop-saturate-[1.7]',
    'before:[-webkit-mask-image:linear-gradient(to_bottom,transparent,rgb(0_0_0/0.88)_160px)] before:[mask-image:linear-gradient(to_bottom,transparent,rgb(0_0_0/0.88)_160px)]',
  ].join(' '),
)

/** Dekorativna dot-grid tekstura na navy podlozi (boja iz tokena). */
export const footerDotGridVariants = cva(
  'pointer-events-none absolute inset-0 bg-[radial-gradient(currentColor_1px,transparent_1px)] bg-[length:22px_22px] text-border-strong/40',
)

export const footerTopVariants = cva(
  'flex flex-col justify-between gap-10 border-b border-border pb-12 md:flex-row md:items-end',
)

export const footerHeadlineVariants = cva(
  'max-w-[15ch] font-heading text-4xl leading-[1.02] font-bold tracking-tight md:text-[54px]',
)

export const footerGridVariants = cva(
  'grid grid-cols-1 gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1.2fr]',
)

export const footerGroupTitleVariants = cva(
  'mb-4 font-mono text-[11.5px] tracking-[0.1em] uppercase text-faint',
)

/**
 * Strelica ispred linka (docs/22 §7) — kroz `::before`, ne kao čvor u JSX-u,
 * pa je automatski nevidljiva za screen reader i ne ulazi u tekst linka.
 * Pomera se udesno na hover.
 */
export const footerLinkVariants = cva(
  "inline-flex items-center gap-2 text-[14.5px] text-muted-foreground transition-colors before:text-faint before:transition-transform before:content-['→'] hover:text-display hover:before:translate-x-0.5",
)

export const footerTextVariants = cva(
  'max-w-[290px] text-[14.5px] leading-relaxed text-muted-foreground',
)

export const footerSocialVariants = cva(
  'inline-flex size-[42px] items-center justify-center rounded-xl border border-border text-muted-foreground transition-[background-color,color,border-color] duration-200 hover:border-primary hover:bg-primary hover:text-primary-foreground [&_svg]:size-[18px]',
)

export const footerBottomVariants = cva(
  'flex flex-col items-center justify-between gap-3 border-t border-border py-6 sm:flex-row',
)

export const footerBottomTextVariants = cva(
  'font-mono text-[11.5px] tracking-wide text-faint transition-colors hover:text-display',
)

/* --- Slim varijanta (podstranice) --- */
export const footerSlimRowVariants = cva(
  'flex flex-col items-center justify-between gap-4 py-7 sm:flex-row',
)
