import type { InputHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

import { inputVariants } from './Input.variants'

export const Input = ({ className, type, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input type={type} className={cn(inputVariants(), className)} {...props} />
)
