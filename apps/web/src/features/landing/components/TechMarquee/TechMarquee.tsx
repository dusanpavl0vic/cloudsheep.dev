import { TechTile } from '@/components/TechTile'
import type { Technology } from '@/features/projects'

import {
  techEdgeVariants,
  techGroupVariants,
  techItemVariants,
  techMarqueeVariants,
  techTrackVariants,
} from './TechMarquee.variants'

/**
 * Jedna kopija liste.
 *
 * Traka mora da sadrži dve identične kopije: kad se prva odklizi za tačno pola širine,
 * druga je zauzela njeno mesto, pa petlja nema šav. Duplikat je `aria-hidden` — screen
 * reader ne sme da pročita isti spisak dvaput.
 */
function TechGroup({ items, duplicate }: { items: readonly Technology[]; duplicate?: boolean }) {
  return (
    <ul className={techGroupVariants()} {...(duplicate ? { 'aria-hidden': true } : {})}>
      {items.map((item) => (
        <li key={item.id} className={techItemVariants()}>
          <TechTile key={item.id} label={item.label} icon={item.logoUrl} size="sm" />
          {item.label}
        </li>
      ))}
    </ul>
  )
}

/**
 * Beskonačna traka sa tehnologijama koje koristimo.
 *
 * Animacija je čist CSS (`cs-marquee`) i pomera `transform` — na compositor-u, bez
 * relayout-a. Staje na hover i na `prefers-reduced-motion`.
 */
interface TechMarqueeProps {
  technologies: readonly Technology[]
}

export function TechMarquee({ technologies }: TechMarqueeProps) {
  // Prazan spisak: traka bi bila prazna kutija, pa se ne renderuje uopšte
  if (technologies.length === 0) return null

  return (
    <div className={techMarqueeVariants()}>
      <span aria-hidden className={techEdgeVariants({ side: 'left' })} />

      <div className={techTrackVariants()}>
        <TechGroup items={technologies} />
        <TechGroup items={technologies} duplicate />
      </div>

      <span aria-hidden className={techEdgeVariants({ side: 'right' })} />
    </div>
  )
}
