import type { ReactNode } from 'react'

import { cn } from '@/lib/cn'

import {
  accordionContentVariants,
  accordionIconVariants,
  accordionItemVariants,
  accordionTriggerVariants,
} from './Accordion.variants'

export interface AccordionEntry {
  id: string
  question: ReactNode
  answer: ReactNode
}

interface AccordionProps {
  items: AccordionEntry[]
  className?: string
}

/**
 * Native <details> — otvaranje/zatvaranje radi browser, bez state-a i useEffect-a.
 */
export const Accordion = ({ items, className }: AccordionProps) => (
  <div className={cn('flex flex-col', className)}>
    {items.map((item) => (
      <details key={item.id} className={accordionItemVariants()}>
        <summary className={accordionTriggerVariants()}>
          {item.question}
          <span aria-hidden className={accordionIconVariants()}>
            +
          </span>
        </summary>
        <div className={accordionContentVariants()}>{item.answer}</div>
      </details>
    ))}
  </div>
)
