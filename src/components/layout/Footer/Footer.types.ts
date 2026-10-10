import type { SocialLink } from '@/types/profile'

export interface FooterProps {
  /** Vidljivi linkovi iz profila (GitHub, LinkedIn, email). */
  links: SocialLink[]
  /** Prva tri objavljena projekta za kolonu „Radovi". */
  projects: { slug: string; title: string }[]
  className?: string
}
