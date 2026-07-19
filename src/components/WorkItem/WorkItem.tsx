import type { VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'

import { LogoMark } from '@/components/Logo'
import { TagList } from '@/components/TagList'
import { cn } from '@/lib/cn'

import {
  workBodyVariants,
  workCaptionVariants,
  workIndexVariants,
  workItemVariants,
  workMediaVariants,
  workMetaVariants,
  workTextVariants,
  workTitleVariants,
} from './WorkItem.variants'

type WorkItemProps = VariantProps<typeof workItemVariants> & {
  index: string
  title: string
  meta: string
  description: string
  tags: readonly string[]
  /** Tekst ispod placeholdera dok slika ne postoji */
  imageCaption: string
  imageSrc?: string
  action?: ReactNode
  className?: string
}

export const WorkItem = ({
  index,
  title,
  meta,
  description,
  tags,
  imageCaption,
  imageSrc,
  action,
  media,
  className,
}: WorkItemProps) => (
  <article className={cn(workItemVariants({ media }), className)}>
    <div className={workMediaVariants({ media })}>
      {imageSrc ? (
        <img src={imageSrc} alt={imageCaption} className="size-full rounded-xl object-cover" />
      ) : (
        <span className="flex flex-col items-center gap-3">
          <LogoMark className="h-8 w-auto" />
          <span className={workCaptionVariants()}>{imageCaption}</span>
        </span>
      )}
    </div>

    <div className={workBodyVariants({ media })}>
      <span className={workIndexVariants()}>{index}</span>
      <h3 className={workTitleVariants()}>{title}</h3>
      <span className={workMetaVariants()}>{meta}</span>
      <p className={workTextVariants()}>{description}</p>
      <TagList tags={tags} className="pt-1" />
      {action}
    </div>
  </article>
)
