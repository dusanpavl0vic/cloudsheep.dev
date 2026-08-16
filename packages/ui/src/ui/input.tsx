import type { InputHTMLAttributes } from 'react'

import { inputVariants } from './input.variants'
import { cn } from '../lib/cn'


export const Input = ({ className, type, ...props }: InputHTMLAttributes<HTMLInputElement>) => (
  <input type={type} className={cn(inputVariants(), className)} {...props} />
)
