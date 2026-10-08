import type { Profile } from '@/types/profile'
import type { TeamMember } from '@/types/team'
import type { Technology } from '@/types/technology'

export interface HomeViewProps {
  technologies: Technology[]
  profile: Profile | null
  team: TeamMember[]
}
