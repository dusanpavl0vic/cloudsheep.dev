import type { ImageRef } from './media'

export interface TeamDiploma {
  university: string
  degree: string
  programme: string
  faculty: string
  city: string
  sealUrl: string | null
}

export interface TeamMember {
  id: string
  fullName: string
  role: string
  avatar: ImageRef | null
  diploma: TeamDiploma | null
}

export interface AdminTeamMember {
  id: string
  fullName: string
  roleSr: string
  roleEn: string
  avatarId: string | null
  avatarUrl: string | null
  hasDiploma: boolean
  universitySr: string
  universityEn: string
  degreeSr: string
  degreeEn: string
  programmeSr: string
  programmeEn: string
  facultySr: string
  facultyEn: string
  city: string
  sealId: string | null
  sealUrl: string | null
  sortOrder: number
  isVisible: boolean
}
