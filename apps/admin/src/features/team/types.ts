export interface TeamMember {
  id: string
  fullName: string
  roleSr: string
  roleEn: string
  avatarId: string | null
  avatarUrl: string | null
  /** Kad je `false`, sajt NE renderuje karticu diplome — član i dalje stoji u timu. */
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

export interface TeamListResponse {
  items: TeamMember[]
}
