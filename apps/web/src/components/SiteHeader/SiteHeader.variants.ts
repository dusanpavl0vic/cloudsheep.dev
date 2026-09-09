import { cva } from 'class-variance-authority'

/**
 * Header prati zaobljeni okvir stranice, pa umesto pune ivice preko celog ekrana
 * nosi hairline koji se gasi na krajevima — inače linija seče zaobljene uglove.
 */
export const siteHeaderVariants = cva(
  // Header je jedina površina koja je i pre redizajna bila staklena. Sad uzima iste
  // tokene kao ostale, umesto sopstvenog `/80` i `blur-xl`.
  "sticky top-0 z-60 w-full bg-glass-strong backdrop-blur-glass-strong after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-linear-to-r after:from-transparent after:via-glass-edge after:to-transparent after:content-['']",
)

export const siteHeaderInnerVariants = cva('flex h-[72px] items-center gap-7')

export const siteNavVariants = cva('ml-auto hidden items-center gap-7 lg:flex')

export const siteNavLinkVariants = cva(
  'nav-underline text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground',
)
