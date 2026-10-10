import type { Profile } from '@/types/profile'
import type { TeamMember } from '@/types/team'

export interface StudioProps {
  /** Naslov i biografija iz admin-a; bez profila — tekst iz poruka. */
  profile: Profile | null
  team: TeamMember[]
}
