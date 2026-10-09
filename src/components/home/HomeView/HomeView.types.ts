import type { Profile } from '@/types/profile'
import type { ProjectSummary } from '@/types/project'
import type { TeamMember } from '@/types/team'
import type { Technology } from '@/types/technology'
import type { Testimonial } from '@/types/testimonial'

export interface HomeViewProps {
  technologies: Technology[]
  profile: Profile | null
  team: TeamMember[]
  projects: ProjectSummary[]
  testimonials: Testimonial[]
  /** Adresa studija za CTA traku. */
  email: string | null
}
