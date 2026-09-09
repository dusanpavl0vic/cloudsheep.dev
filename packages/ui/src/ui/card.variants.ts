import { cva } from 'class-variance-authority'

import { glassVariants } from '../lib/surface.variants'

/**
 * Recept se ne prepisuje ovde — uzima se iz `glassVariants` (docs/22 §3). Ranije je ovde
 * stajalo `border-border bg-card shadow-sm`: puna podloga i uska senka, dakle tačno ono
 * što novi §3 zabranjuje.
 */
export const cardVariants = cva([glassVariants({ radius: 'md' }), 'text-card-foreground'].join(' '))

export const cardHeaderVariants = cva('flex flex-col gap-1.5 p-8')

export const cardTitleVariants = cva('font-heading text-xl leading-none font-semibold text-primary')

export const cardContentVariants = cva('p-8 pt-0')
