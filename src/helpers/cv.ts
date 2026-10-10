import type { z } from 'zod'

import type { cvFormSchema, CvForm, CvInput } from '@/schemas/cv'
import type { AdminCv } from '@/types/cv'

const lines = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

const commaList = (text: string) =>
  text
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

/** CV sa servera → vrednosti forme (nizovi postaju tekst). */
export const cvToForm = (cv: AdminCv): CvForm => {
  const { memberId: _memberId, fullName: _fullName, roleSr: _roleSr, roleEn: _roleEn, siteProjects, experiences, ...fields } = cv
  return {
    ...fields,
    siteProjects: siteProjects.map(({ projectId, noteSr, noteEn }) => ({ projectId, noteSr, noteEn })),
    experiences: experiences.map((experience) => ({
      ...experience,
      bulletsSr: experience.bulletsSr.join('\n'),
      bulletsEn: experience.bulletsEn.join('\n'),
      technologies: experience.technologies.join(', '),
    })),
  }
}

/** Vrednosti forme → telo `PUT /cv` (tekst postaje nizovi, prazni redovi otpadaju). */
export const toCvInput = (form: z.output<typeof cvFormSchema>): CvInput => ({
  ...form,
  experiences: form.experiences.map((experience) => ({
    ...experience,
    bulletsSr: lines(experience.bulletsSr),
    bulletsEn: lines(experience.bulletsEn),
    technologies: commaList(experience.technologies),
  })),
})
