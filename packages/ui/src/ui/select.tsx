import type { SelectHTMLAttributes } from 'react'

import { selectVariants } from './select.variants'
import { cn } from '../lib/cn'

/**
 * Nativni `<select>`, ne Radix.
 *
 * Radix `Select` bi doneo ~25 KB gzip za kontrolu sa četiri opcije, a nativna verzija
 * dobija tastaturu, screen reader i mobilni točkić besplatno i ispravno. Prilagođeni
 * izgled liste opcija je jedino što gubimo — i jedino zbog čega bi se ovo menjalo.
 *
 * Opcije se prosleđuju kao `children`, pa `Select` ne zna za oblik podataka app-e.
 */
export const Select = ({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) => (
  <select className={cn(selectVariants(), className)} {...props}>
    {children}
  </select>
)
