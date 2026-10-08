import 'server-only'

import type {
  Asset,
  CvExperience,
  CvLanguage,
  CvSiteProject,
  Project,
  ProjectImage,
  TeamMember,
  Technology,
} from '@prisma/client'

/** Prisma `include` za projekat sa svim vezama koje serijalizacija traži. Jedno mesto. */
export const projectInclude = {
  technologies: {
    include: { technology: { include: { logo: true } } },
    orderBy: { sortOrder: 'asc' },
  },
  images: { include: { asset: true }, orderBy: { sortOrder: 'asc' } },
} as const

export type TechnologyWithLogo = Technology & { logo: Asset | null }

export type ProjectWithRelations = Project & {
  technologies: { sortOrder: number; technology: TechnologyWithLogo }[]
  images: (ProjectImage & { asset: Asset })[]
}

/** CV: redosled je deo podatka, pa se sortira ovde, jednom. */
export const cvInclude = {
  cvSiteProjects: {
    orderBy: { sortOrder: 'asc' },
    include: { project: { include: projectInclude } },
  },
  cvExperiences: { orderBy: { sortOrder: 'asc' } },
  cvLanguages: { orderBy: { sortOrder: 'asc' } },
} as const

export type MemberWithCv = TeamMember & {
  cvExperiences: CvExperience[]
  cvLanguages: CvLanguage[]
  cvSiteProjects: (CvSiteProject & { project: ProjectWithRelations })[]
}

/** Redosled iz niza id-eva: pozicija u nizu JESTE redosled. */
export const orderUpdates = <T>(ids: string[], update: (id: string, sortOrder: number) => T) =>
  ids.map((id, index) => update(id, index))
