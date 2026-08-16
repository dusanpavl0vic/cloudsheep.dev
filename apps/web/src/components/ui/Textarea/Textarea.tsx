import type { TextareaHTMLAttributes } from 'react'

import { cn } from '@/lib/cn'

import { textareaVariants } from './Textarea.variants'

export const Textarea = ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={cn(textareaVariants(), className)} {...props} />
)
