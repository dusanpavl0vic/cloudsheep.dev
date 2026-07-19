import type { VariantProps } from 'class-variance-authority'
import type { ElementType, HTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

import { containerVariants } from './Container.variants'

type ContainerProps = HTMLAttributes<HTMLElement> &
  VariantProps<typeof containerVariants> & {
    as?: ElementType
  }

export const Container = ({ className, width, as: Comp = 'div', ...props }: ContainerProps) => (
  <Comp className={cn(containerVariants({ width }), className)} {...props} />
)
