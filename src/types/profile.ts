export interface SocialLink {
  id: string
  platform: string
  url: string
  label: string
}

/** Javni profil studija, na jeziku stranice. `null` polja kad profil još nije popunjen. */
export interface Profile {
  fullName: string
  location: string
  isAvailable: boolean
  headline: string
  bio: string
}

export interface SiteProfile {
  profile: Profile | null
  links: SocialLink[]
}

export interface AdminProfile {
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

export interface AdminSocialLink extends SocialLink {
  isVisible: boolean
  sortOrder: number
}
