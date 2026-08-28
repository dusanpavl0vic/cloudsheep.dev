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

/**
 * CV člana, u obliku u kom ga vraća `GET /admin/team/:id/cv`.
 *
 * Nizovi (`bulletsSr`, `technologies`) su ovde PRAVI nizovi — forma ih prikazuje kao tekst,
 * a pretvaranje radi `useCv`. Serverski oblik ne sme da nosi trag načina unosa.
 */
export interface CvExperience {
  company: string
  positionSr: string
  positionEn: string
  locationSr: string
  locationEn: string
  startYear: number
  startMonth: number | null
  endYear: number | null
  endMonth: number | null
  summarySr: string
  summaryEn: string
  bulletsSr: string[]
  bulletsEn: string[]
  technologies: string[]
}

export interface CvProject {
  name: string
  summarySr: string
  summaryEn: string
  bulletsSr: string[]
  bulletsEn: string[]
  technologies: string[]
  noteSr: string
  noteEn: string
  year: number | null
  repoUrl: string
  liveUrl: string
}

export interface CvSkill {
  name: string
  groupSr: string
  groupEn: string
  years: number | null
}

export interface CvLanguage {
  nameSr: string
  nameEn: string
  levelSr: string
  levelEn: string
}

export interface Cv {
  memberId: string
  fullName: string
  roleSr: string
  roleEn: string
  email: string
  phone: string
  githubUrl: string
  linkedinUrl: string
  websiteUrl: string
  locationSr: string
  locationEn: string
  summarySr: string
  summaryEn: string
  educationStatusSr: string
  educationStatusEn: string
  gpa: string
  educationStartYear: number | null
  educationEndYear: number | null
  experiences: CvExperience[]
  projects: CvProject[]
  skills: CvSkill[]
  languages: CvLanguage[]
}

/** Jezik CV-a. Isti par koji nosi i sam sajt. */
export type CvLang = 'sr' | 'en'
