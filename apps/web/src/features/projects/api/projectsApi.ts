import { apiGet } from '@/lib/apiClient'

import {
  projectListSchema,
  projectSchema,
  technologyListSchema,
  type Project,
  type Technology,
} from '../types'

/** Svi objavljeni projekti, sortirani onako kako ih admin panel poređa. */
export const fetchProjects = async (): Promise<Project[]> =>
  (await apiGet('/projects', projectListSchema)).items

export const fetchProject = (slug: string): Promise<Project> =>
  apiGet(`/projects/${slug}`, projectSchema)

/** Spisak tehnologija za sekciju „Stack". Ranije statični niz u `lib/tech.ts`. */
export const fetchTechnologies = async (): Promise<Technology[]> =>
  (await apiGet('/technologies', technologyListSchema)).items
