import type { ImageRef } from '@/types/media'

export interface CoverProps {
  image: ImageRef | null
  /** Tekst za `alt` kad slika nema svoj (naslov projekta/beleške). */
  fallbackAlt: string
  /** Odnos stranica (dizajn: kartica 16/11, beleška 16/10). */
  ratio?: string
  radius?: number
  /** Slika iznad fold-a se ne učitava lenjo (LCP). */
  eager?: boolean
  className?: string
}
