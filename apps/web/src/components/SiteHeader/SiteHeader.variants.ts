import { cva } from 'class-variance-authority'

import { glassVariants } from '@app/ui'

/**
 * Header prati zaobljeni okvir stranice, pa umesto pune ivice preko celog ekrana
 * nosi hairline koji se gasi na krajevima — inače linija seče zaobljene uglove.
 */
export const siteHeaderVariants = cva(
  // Header je jedina površina koja je i pre redizajna bila staklena. Sad nosi isti
  // materijal kao sve ostalo — uključujući saturaciju i spekular — umesto sopstvenog
  // `/80` i `blur-xl`. Bez radijusa i bočnih ivica: naleže na ivicu okvira.
  [
    glassVariants({ elevation: 'flat', radius: 'md', overlay: true }),
    'sticky top-0 z-60 w-full rounded-none border-x-0 border-t-0 border-b-0',
    "after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-linear-to-r after:from-transparent after:via-glass-edge after:to-transparent after:content-['']",
  ].join(' '),
)

export const siteHeaderInnerVariants = cva('flex h-[72px] items-center gap-7')

export const siteNavVariants = cva('ml-auto hidden items-center gap-7 lg:flex')

export const siteNavLinkVariants = cva(
  'nav-underline text-[15px] font-medium text-muted-foreground transition-colors hover:text-foreground',
)
