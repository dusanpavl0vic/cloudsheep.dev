import type { VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { SpiralMark } from '@/components/Logo'
import { Reveal } from '@/components/Reveal'
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

type WorkItemProps = {
  index: string
  title: string
  meta: string
  description: string
  tags: readonly string[]
  /** Tekst ispod placeholdera dok slika ne postoji */
  imageCaption: string
  imageSrc?: string
  /** Ruta ka studiji slučaja */
  to: string
  action?: ReactNode
  /** Strana na kojoj stoji slika — određuje smer uleta pri skrolovanju */
  media?: 'start' | 'end'
  className?: string
} & VariantProps<typeof workItemVariants>

export const WorkItem = ({
  index,
  title,
  meta,
  description,
  tags,
  imageCaption,
  imageSrc,
  to,
  action,
  media = 'start',
  className,
}: WorkItemProps) => {
  const mediaFirst = media === 'start'

  return (
    <article className={cn(workItemVariants(), className)}>
      <Reveal
        direction={mediaFirst ? 'left' : 'right'}
        className={mediaFirst ? 'md:order-1' : 'md:order-2'}
      >
        <Link to={to} aria-label={title} className={workMediaVariants()}>
          {imageSrc ? (
            <img src={imageSrc} alt={imageCaption} className="size-full object-cover" />
          ) : (
            <span className="flex flex-col items-center gap-3">
              <SpiralMark className="size-9 text-primary/40" />
              <span className={workCaptionVariants()}>{imageCaption}</span>
            </span>
          )}
        </Link>
      </Reveal>

      <Reveal
        direction={mediaFirst ? 'right' : 'left'}
        className={cn(workBodyVariants(), mediaFirst ? 'md:order-2' : 'md:order-1')}
      >
        <span className={workIndexVariants()}>{index}</span>
        <h3 className={workTitleVariants()}>{title}</h3>
        <span className={workMetaVariants()}>{meta}</span>
        <p className={workTextVariants()}>{description}</p>
        <TagList tags={tags} variant="outline" font="sans" className="pt-1 pb-2" />
        {action}
      </Reveal>
    </article>
  )
}
