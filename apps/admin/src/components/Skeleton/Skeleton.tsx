import { cn } from '@app/ui'

import {
  skeletonFieldVariants,
  skeletonLabelVariants,
  skeletonRowVariants,
  skeletonVariants,
} from './Skeleton.variants'

interface SkeletonProps {
  shape?: 'line' | 'title' | 'field' | 'thumb'
  className?: string
}

/** Jedan blok. Sam po sebi ne znači ništa — uvek stoji unutar `SkeletonList`/`SkeletonForm`. */
export const Skeleton = ({ shape, className }: SkeletonProps) => (
  <span aria-hidden className={cn(skeletonVariants({ shape }), className)} />
)

interface SkeletonPlaceholderProps {
  /**
   * Šta se učitava — pročita screen reader, isto kao kod `Spinner`-a.
   *
   * Koriste se POSTOJEĆI ključevi (`projects.loading`, `profile.loading`…), pa zamena
   * vrteške skeletonom ne traži ni jedan nov prevod.
   */
  label: string
}

/**
 * Blokovi su `aria-hidden`, kontejner nosi `aria-busy`, a najavu daje **jedna**
 * `role="status"` oblast.
 *
 * Da su blokovi u pristupačnom stablu, čitač ekrana bi za listu od šest redova pročitao
 * desetak praznih elemenata pre nego što stigne do bilo čega korisnog.
 */
export const SkeletonList = ({ rows = 5, label }: SkeletonPlaceholderProps & { rows?: number }) => (
  <div aria-busy>
    <span role="status" className="sr-only">
      {label}
    </span>

    {Array.from({ length: rows }, (_, index) => (
      <div key={index} className={skeletonRowVariants()}>
        <Skeleton shape="thumb" />
        <Skeleton className="w-2/5" />
        <Skeleton className="ms-auto w-16" />
      </div>
    ))}
  </div>
)

export const SkeletonForm = ({
  fields = 6,
  label,
}: SkeletonPlaceholderProps & { fields?: number }) => (
  <div aria-busy className="flex max-w-2xl flex-col gap-5">
    <span role="status" className="sr-only">
      {label}
    </span>

    <Skeleton shape="title" className="w-1/3" />

    {Array.from({ length: fields }, (_, index) => (
      <div key={index} className={skeletonFieldVariants()}>
        <span aria-hidden className={skeletonLabelVariants()} />
        <Skeleton shape="field" />
      </div>
    ))}
  </div>
)
