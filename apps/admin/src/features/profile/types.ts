export interface Profile {
  fullName: string
  location: string
  isAvailable: boolean
  headlineSr: string
  headlineEn: string
  bioSr: string
  bioEn: string
  universitySr: string
  universityEn: string
  degreeSr: string
  degreeEn: string
}

export interface SocialLink {
  id: string
  /** `github` | `linkedin` | `instagram` | `x` | `email` | `other` */
  platform: string
  url: string
  label: string
  sortOrder: number
  isVisible: boolean
}

export interface ProfileResponse {
  /** `null` dok profil nije nijednom sačuvan. */
  profile: Profile | null
  links: SocialLink[]
}
