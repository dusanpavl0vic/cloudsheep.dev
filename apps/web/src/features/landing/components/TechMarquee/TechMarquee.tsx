import { TECH_ITEMS, type TechItem } from '@/features/landing/tech.constants'
import { GLYPHS } from '@/lib/glyphs'

import { TECH_ICONS } from './TechIcon'
import {
  techEdgeVariants,
  techGroupVariants,
  techIconVariants,
  techItemVariants,
  techMarqueeVariants,
  techSeparatorVariants,
  techTrackVariants,
} from './TechMarquee.variants'

/**
 * Jedna kopija liste.
 *
 * Traka mora da sadrži dve identične kopije: kad se prva odklizi za tačno pola širine,
 * druga je zauzela njeno mesto, pa petlja nema šav. Duplikat je `aria-hidden` — screen
 * reader ne sme da pročita isti spisak dvaput.
 */
function TechGroup({ items, duplicate }: { items: readonly TechItem[]; duplicate?: boolean }) {
  return (
    <ul className={techGroupVariants()} {...(duplicate ? { 'aria-hidden': true } : {})}>
      {items.map((item) => {
        const Icon = TECH_ICONS[item.id]

        return (
          <li key={item.id} className={techItemVariants()}>
            <Icon className={techIconVariants()} />
            {item.label}
            <span aria-hidden className={techSeparatorVariants()}>
              {GLYPHS.SPARKLE}
            </span>
          </li>
        )
      })}
    </ul>
  )
}

/**
 * Beskonačna traka sa tehnologijama koje koristimo.
 *
 * Animacija je čist CSS (`cs-marquee`) i pomera `transform` — dakle na compositor-u, bez
 * relayout-a. Staje na hover i na `prefers-reduced-motion`.
 */
export function TechMarquee() {
  return (
    <div className={techMarqueeVariants()}>
      <span aria-hidden className={techEdgeVariants({ side: 'left' })} />

      <div className={techTrackVariants()}>
        <TechGroup items={TECH_ITEMS} />
        <TechGroup items={TECH_ITEMS} duplicate />
      </div>

      <span aria-hidden className={techEdgeVariants({ side: 'right' })} />
    </div>
  )
}
