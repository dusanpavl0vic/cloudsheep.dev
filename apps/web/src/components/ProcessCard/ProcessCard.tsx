import type { VariantProps } from 'class-variance-authority'

import { cn } from '@app/ui'


import {
  processCardVariants,
  processIndexVariants,
  processMetaVariants,
  processTextVariants,
  processTitleVariants,
} from './ProcessCard.variants'

type ProcessCardProps = VariantProps<typeof processCardVariants> & {
  index: string
  title: string
  description: string
  meta: string
  className?: string
}

export const ProcessCard = ({
  index,
  title,
  description,
  meta,
  tone,
  className,
}: ProcessCardProps) => (
  <article className={cn(processCardVariants({ tone }), className)}>
    <span className={processIndexVariants()}>{index}</span>
    <h3 className={processTitleVariants()}>{title}</h3>
    <p className={processTextVariants()}>{description}</p>
    <span className={processMetaVariants()}>{meta}</span>
  </article>
)
