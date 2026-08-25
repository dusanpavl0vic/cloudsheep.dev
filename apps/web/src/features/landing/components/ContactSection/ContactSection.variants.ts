import { cva } from 'class-variance-authority'

export const contactBannerVariants = cva(
  'relative flex flex-col items-center gap-3.5 overflow-hidden rounded-[24px] bg-inverse px-8 py-20 text-center',
)

// `h-12 w-auto`, ne `size-12`: `viewBox` marke je 136×126 i NIJE kvadratan, pa je
// `size-*` sabija po širini. Vidljivo je otkad je marka puna ploha, a ne linijski crtež.
// `[--logo-edge-width:0]`: obrub marke postoji zbog SVETLE podloge, gde se ploha stapa
// sa stranom. Ova traka je `bg-inverse` — tamna i u svetloj temi — pa se marka na njoj
// ponaša kao u tamnoj temi: bez obruba. Bez ovoga bi jedina marka na tamnoj površini
// nosila okvir koji nijedna druga nema.
export const contactMarkVariants = cva(
  'relative mb-2 h-12 w-auto text-primary [--logo-edge-width:0]',
)

export const contactTitleVariants = cva(
  'relative font-heading text-4xl leading-tight font-bold tracking-tight text-balance text-inverse-foreground md:text-[52px]',
)

export const contactEmailVariants = cva(
  'relative font-mono text-[15px] text-inverse-primary transition-colors hover:brightness-110',
)
