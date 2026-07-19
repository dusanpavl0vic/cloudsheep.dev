import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Spaja Tailwind klase i razrešava konflikte (shadcn konvencija). */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))
