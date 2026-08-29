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

export interface CvLanguage {
  nameSr: string
  nameEn: string
  levelSr: string
  levelEn: string
}

/** Projekat sa sajta uvršten u CV. `title` i `year` dolaze sa servera, samo za prikaz. */
export interface CvSiteProject {
  projectId: string
  title: string
  year: number
  /** Samo za prikaz u formi; dolazi iz `Project` tabele i tamo se menja. */
  summary: string
  technologies: string[]
  noteSr: string
  noteEn: string
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
  educationStatusSr: string
  educationStatusEn: string
  gpa: string
  educationStartYear: number | null
  educationEndYear: number | null
  siteProjects: CvSiteProject[]
  experiences: CvExperience[]
  languages: CvLanguage[]
}

/** Jezik CV-a. Isti par koji nosi i sam sajt. */
export type CvLang = 'sr' | 'en'
