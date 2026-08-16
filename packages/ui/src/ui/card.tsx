import type { HTMLAttributes } from 'react'

import {
  cardContentVariants,
  cardHeaderVariants,
  cardTitleVariants,
  cardVariants,
} from './card.variants'
import { cn } from '../lib/cn'


export const Card = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(cardVariants(), className)} {...props} />
)

export const CardHeader = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(cardHeaderVariants(), className)} {...props} />
)

export const CardTitle = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(cardTitleVariants(), className)} {...props} />
)

export const CardContent = ({ className, ...props }: HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(cardContentVariants(), className)} {...props} />
)
