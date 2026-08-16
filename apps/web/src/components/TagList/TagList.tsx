import type { VariantProps } from 'class-variance-authority'

import { Badge } from '@/components/ui/Badge'
import { type badgeVariants } from '@/components/ui/Badge/Badge.variants'
import { cn } from '@/lib/cn'

import { tagListVariants } from './TagList.variants'

type TagListProps = Pick<VariantProps<typeof badgeVariants>, 'variant' | 'size' | 'font'> & {
  tags: readonly string[]
  className?: string
}

/** Lista tehnoloških oznaka — prosleđuje varijante dalje na Badge. */
export const TagList = ({ tags, variant, size, font, className }: TagListProps) => (
  <ul className={cn(tagListVariants(), className)}>
    {tags.map((tag) => (
      <li key={tag}>
        <Badge variant={variant} size={size} font={font}>
          {tag}
        </Badge>
      </li>
    ))}
  </ul>
)
