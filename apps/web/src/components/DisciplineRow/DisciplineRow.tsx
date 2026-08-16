import type { VariantProps } from 'class-variance-authority'

import { TagList } from '@/components/TagList'
import { cn } from '@/lib/cn'

import {
  disciplineArrowVariants,
  disciplineIndexVariants,
  disciplineRowVariants,
  disciplineTextVariants,
  disciplineTitleVariants,
} from './DisciplineRow.variants'

type DisciplineRowProps = VariantProps<typeof disciplineRowVariants> & {
  index: string
  title: string
  description: string
  tags: readonly string[]
  className?: string
}

export const DisciplineRow = ({
  index,
  title,
  description,
  tags,
  emphasis,
  className,
}: DisciplineRowProps) => (
  <article className={cn('group', disciplineRowVariants({ emphasis }), className)}>
    <span className={disciplineIndexVariants()}>{index}</span>
    <h3 className={disciplineTitleVariants()}>{title}</h3>
    <div className="flex flex-col gap-3">
      <p className={disciplineTextVariants()}>{description}</p>
      <TagList tags={tags} variant="plain" />
    </div>
    <span aria-hidden className={disciplineArrowVariants()}>
      →
    </span>
  </article>
)
