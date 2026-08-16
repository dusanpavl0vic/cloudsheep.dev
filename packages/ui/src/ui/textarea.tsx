import type { TextareaHTMLAttributes } from 'react'

import { textareaVariants } from './textarea.variants'
import { cn } from '../lib/cn'


export const Textarea = ({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea className={cn(textareaVariants(), className)} {...props} />
)
