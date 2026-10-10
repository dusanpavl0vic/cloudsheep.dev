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

export interface CvSiteProject {
  projectId: string
  title: string
  year: number
  summary: string
  technologies: string[]
  noteSr: string
  noteEn: string
}

export interface CvLanguage {
  nameSr: string
  nameEn: string
  levelSr: string
  levelEn: string
}

export interface AdminCv {
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
  experiences: CvExperience[]
  siteProjects: CvSiteProject[]
  languages: CvLanguage[]
}
