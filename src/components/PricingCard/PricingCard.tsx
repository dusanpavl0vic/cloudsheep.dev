import type { VariantProps } from 'class-variance-authority'

import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/cn'

import {
  pricingBadgeVariants,
  pricingCardVariants,
  pricingFeatureListVariants,
  pricingFeatureVariants,
  pricingPriceVariants,
  pricingTextVariants,
  pricingTitleVariants,
} from './PricingCard.variants'

type PricingCardProps = VariantProps<typeof pricingCardVariants> & {
  title: string
  price: string
  description: string
  features: readonly string[]
  /** Tekst plakete iznad kartice (npr. "most popular") — prikazuje se samo ako postoji */
  badge?: string
  className?: string
}

export const PricingCard = ({
  title,
  price,
  description,
  features,
  badge,
  featured,
  className,
}: PricingCardProps) => (
  <article className={cn(pricingCardVariants({ featured }), className)}>
    {badge && (
      <Badge variant="accent" className={pricingBadgeVariants()}>
        {badge}
      </Badge>
    )}
    <h3 className={pricingTitleVariants({ featured })}>{title}</h3>
    <span className={pricingPriceVariants({ featured })}>{price}</span>
    <p className={pricingTextVariants({ featured })}>{description}</p>
    <ul className={pricingFeatureListVariants()}>
      {features.map((feature) => (
        <li key={feature} className={pricingFeatureVariants({ featured })}>
          <span aria-hidden className="font-semibold text-primary">
            ✓
          </span>
          {feature}
        </li>
      ))}
    </ul>
  </article>
)
