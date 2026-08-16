import type { VariantProps } from 'class-variance-authority'

import { tagListIconVariants, tagListVariants } from './TagList.variants'
import { cn } from '../../lib/cn'
import { Badge } from '../../ui/badge'
import { type badgeVariants } from '../../ui/badge.variants'

/**
 * Oznaka je ili čist tekst, ili tekst sa logotipom.
 *
 * Ikonica dolazi kao PODATAK, a ne kroz mapiranje unutar komponente: `packages/ui` ne sme
 * da zna koja tehnologija ima koji logotip (`packages/ui/CLAUDE.md`). App prosleđuje
 * gotovu putanju, paket je samo crta.
 */
export type TagListItem = string | { label: string; icon?: string | undefined }

type TagListProps = Pick<VariantProps<typeof badgeVariants>, 'variant' | 'size' | 'font'> & {
  tags: readonly TagListItem[]
  className?: string
}

const toTag = (tag: TagListItem) => (typeof tag === 'string' ? { label: tag } : tag)

/**
 * Lista tehnoloških oznaka — prosleđuje varijante dalje na Badge.
 *
 * Logotip je `alt=""` + `aria-hidden`: naziv tehnologije stoji odmah pored njega, pa bi
 * opisan alt naterao screen reader da isti tag pročita dvaput.
 *
 * Nema rezerve za slučaj da fajl nedostaje. Oznaka bez logotipa je predviđeno stanje
 * (tehnologije poput `GTFS` ga i nemaju), pa pozivalac prosto ne šalje `icon`; da putanja
 * pokazuje na nepostojeći fajl, to je greška u podacima app-e i tamo se i hvata.
 */
export const TagList = ({ tags, variant, size, font, className }: TagListProps) => (
  <ul className={cn(tagListVariants(), className)}>
    {tags.map(toTag).map(({ label, icon }) => (
      <li key={label}>
        <Badge variant={variant} size={size} font={font}>
          {icon && (
            <img
              src={icon}
              alt=""
              aria-hidden
              width={16}
              height={16}
              loading="lazy"
              decoding="async"
              className={tagListIconVariants()}
            />
          )}
          {label}
        </Badge>
      </li>
    ))}
  </ul>
)
