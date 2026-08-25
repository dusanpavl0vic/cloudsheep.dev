import { cva } from 'class-variance-authority'

export const contactBannerVariants = cva(
  'relative flex flex-col items-center gap-3.5 overflow-hidden rounded-[24px] bg-inverse px-8 py-20 text-center',
)

// `h-12 w-auto`, ne `size-12`: `viewBox` marke je 136×126 i NIJE kvadratan, pa je
// `size-*` sabija po širini. Vidljivo je otkad je marka puna ploha, a ne linijski crtež.
// `[--mark-halo:var(--inverse)]`: marka nosi obrub preko haloa u boji PODLOGE, a ova
// traka je `bg-inverse`, ne `background`. Bez override-a bi se oko marke video svetli
// prsten — halo bi ostao u podrazumevanoj boji strane (`SheepMark`).
export const contactMarkVariants = cva(
  'relative mb-2 h-12 w-auto text-primary [--mark-halo:var(--inverse)]',
)

export const contactTitleVariants = cva(
  'relative font-heading text-4xl leading-tight font-bold tracking-tight text-balance text-inverse-foreground md:text-[52px]',
)

export const contactEmailVariants = cva(
  'relative font-mono text-[15px] text-inverse-primary transition-colors hover:brightness-110',
)
