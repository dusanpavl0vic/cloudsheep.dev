import { cn } from '@app/ui'

import type { Technology } from '../../types'

interface TechTagsProps {
  technologies: readonly Technology[]
  className?: string
}

/**
 * Pločice tehnologija sa logotipom.
 *
 * Zamenjuje `techTags()` iz `lib/tech.ts`, koji je nazive tražio u statičnom nizu i
 * izvodio putanju do SVG-a iz imena fajla. Sada i naziv i logotip stižu kao podatak, pa se
 * tehnologija dodaje u adminu, ne u repou.
 *
 * Tehnologija bez logotipa se prikazuje samo kao naziv — isto kao i ranije.
 */
export const TechTags = ({ technologies, className }: TechTagsProps) => {
  if (technologies.length === 0) return null

  return (
    <ul className={cn('flex flex-wrap items-center gap-x-4 gap-y-2', className)}>
      {technologies.map((technology) => (
        <li
          key={technology.id}
          className="text-muted-foreground flex items-center gap-1.5 text-[13.5px] font-medium"
        >
          {technology.logoUrl && (
            <img
              src={technology.logoUrl}
              alt=""
              width={16}
              height={16}
              loading="lazy"
              decoding="async"
              className="size-4 object-contain"
            />
          )}
          {technology.label}
        </li>
      ))}
    </ul>
  )
}
