import { cva } from 'class-variance-authority'

/**
 * Header prati zaobljeni okvir stranice, pa umesto pune ivice preko celog ekrana
 * nosi hairline koji se gasi na krajevima — inače linija seče zaobljene uglove.
 */
export const siteHeaderVariants = cva(
  "sticky top-0 z-60 w-full bg-background/80 backdrop-blur-xl after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-linear-to-r after:from-transparent after:via-border after:to-transparent after:content-['']",
)

export const siteHeaderInnerVariants = cva('flex h-[72px] items-center gap-7')

export const siteNavVariants = cva('ml-auto hidden items-center gap-7 md:flex')

export const siteNavLinkVariants = cva(
  'nav-underline text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground',
)
