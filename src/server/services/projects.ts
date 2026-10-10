import 'server-only'

import type { Asset, Prisma, ProjectImage } from '@prisma/client'
import type { z } from 'zod'

import { CACHE_TAGS } from '@/constants/cache'
import type { Locale } from '@/constants/i18n'
import { pickLocalized } from '@/helpers/locale'
import type {
  attachImageSchema,
  projectSchema,
  updateImageSchema,
  updateProjectSchema,
} from '@/schemas/project'
import type { ImageRef } from '@/types/media'
import type {
  AdminProject,
  DeviceKind,
  LocalizedChapter,
  LocalizedMetric,
  ProjectDetail,
  ProjectSummary,
} from '@/types/project'

import { cached, invalidate } from '../cache'
import { prisma } from '../db'
import { orderUpdates, projectInclude, type ProjectWithRelations } from './includes'
import { serializeTechnology } from './technologies'
import { publicUrl } from '../uploads/storage'

const metricsOf = (value: Prisma.JsonValue) =>
  Array.isArray(value) ? (value as unknown as LocalizedMetric[]) : []
const chaptersOf = (value: Prisma.JsonValue) =>
  Array.isArray(value) ? (value as unknown as LocalizedChapter[]) : []

const imageRef = (image: ProjectImage & { asset: Asset }, locale: Locale): ImageRef => ({
  url: publicUrl(image.asset.storageKey),
  width: image.asset.width,
  height: image.asset.height,
  alt: pickLocalized(locale, image.altSr, image.altEn),
})

/** Galerija = slike bez uređaja; prva takva je naslovna. */
const galleryOf = (p: ProjectWithRelations) => p.images.filter((image) => image.device === null)

const summary = (p: ProjectWithRelations, locale: Locale): ProjectSummary => {
  const [firstMetric] = metricsOf(p.metrics)
  const [cover] = galleryOf(p)
  return {
    id: p.id,
    slug: p.slug,
    category: p.category,
    year: p.year,
    title: pickLocalized(locale, p.titleSr, p.titleEn),
    tagline: pickLocalized(locale, p.catSr, p.catEn),
    description: pickLocalized(locale, p.descSr, p.descEn),
    isFeatured: p.isFeatured,
    cover: cover ? imageRef(cover, locale) : null,
    metric: firstMetric
      ? {
          value: firstMetric.value,
          label: pickLocalized(locale, firstMetric.labelSr, firstMetric.labelEn),
        }
      : null,
    technologies: p.technologies.map((pt) => serializeTechnology(pt.technology)),
  }
}

const screensOf = (p: ProjectWithRelations, locale: Locale) => {
  const byDevice = (device: DeviceKind) =>
    p.images.filter((image) => image.device === device).map((image) => imageRef(image, locale))
  return { phone: byDevice('phone'), browser: byDevice('browser') }
}

const detail = (
  p: ProjectWithRelations,
  locale: Locale,
  next: ProjectDetail['next'],
): ProjectDetail => ({
  ...summary(p, locale),
  role: pickLocalized(locale, p.roleSr, p.roleEn),
  timeline: pickLocalized(locale, p.timelineSr, p.timelineEn),
  client: p.client,
  caption: pickLocalized(locale, p.captionSr, p.captionEn),
  metrics: metricsOf(p.metrics).map((m) => ({
    value: m.value,
    label: pickLocalized(locale, m.labelSr, m.labelEn),
  })),
  chapters: chaptersOf(p.chapters).map((c) => ({
    title: pickLocalized(locale, c.titleSr, c.titleEn),
    body: pickLocalized(locale, c.bodySr, c.bodyEn),
  })),
  growth: p.growth,
  galleryLayout: p.galleryLayout,
  gallery: galleryOf(p).map((image) => imageRef(image, locale)),
  screens: screensOf(p, locale),
  liveUrl: p.liveUrl,
  repoUrl: p.repoUrl,
  next,
})

const publishedOrder = [
  { sortOrder: 'asc' },
  { year: 'desc' },
] satisfies Prisma.ProjectOrderByWithRelationInput[]

const findPublished = () =>
  prisma.project.findMany({
    where: { isPublished: true },
    orderBy: publishedOrder,
    include: projectInclude,
  })

/** Svi objavljeni projekti, na jeziku stranice. */
export const listPublishedProjects = cached(
  async (locale: Locale) => (await findPublished()).map((p) => summary(p, locale)),
  'projects',
  [CACHE_TAGS.PROJECTS],
)

/** Studija slučaja; `null` → stranica zove `notFound()` (pravi 404, docs/05 §4). */
export const getPublishedProject = cached(
  async (slug: string, locale: Locale): Promise<ProjectDetail | null> => {
    const projects = await findPublished()
    const index = projects.findIndex((p) => p.slug === slug)
    const project = projects[index]
    if (!project) return null

    const following = projects.length > 1 ? projects[(index + 1) % projects.length] : undefined
    return detail(
      project,
      locale,
      following
        ? {
            slug: following.slug,
            title: pickLocalized(locale, following.titleSr, following.titleEn),
          }
        : null,
    )
  },
  'project',
  [CACHE_TAGS.PROJECTS],
)

/** Za sitemap: slug i poslednja izmena. */
export const listProjectSlugs = cached(
  async () =>
    (
      await prisma.project.findMany({
        where: { isPublished: true },
        select: { slug: true, updatedAt: true },
      })
    ).map((p) => ({
      slug: p.slug,
      updatedAt: p.updatedAt.toISOString(),
    })),
  'project-slugs',
  [CACHE_TAGS.PROJECTS],
)

// ─── Admin ────────────────────────────────────────────────────────────────────────

export const serializeAdminProject = (p: ProjectWithRelations): AdminProject => ({
  id: p.id,
  slug: p.slug,
  category: p.category,
  year: p.year,
  sortOrder: p.sortOrder,
  isFeatured: p.isFeatured,
  isPublished: p.isPublished,
  galleryLayout: p.galleryLayout,
  liveUrl: p.liveUrl,
  repoUrl: p.repoUrl,
  titleSr: p.titleSr,
  titleEn: p.titleEn,
  catSr: p.catSr,
  catEn: p.catEn,
  descSr: p.descSr,
  descEn: p.descEn,
  captionSr: p.captionSr,
  captionEn: p.captionEn,
  roleSr: p.roleSr,
  roleEn: p.roleEn,
  timelineSr: p.timelineSr,
  timelineEn: p.timelineEn,
  client: p.client,
  metrics: metricsOf(p.metrics),
  chapters: chaptersOf(p.chapters),
  growth: p.growth,
  technologyIds: p.technologies.map((pt) => pt.technology.id),
  technologies: p.technologies.map((pt) => serializeTechnology(pt.technology)),
  images: p.images.map((i) => ({
    id: i.id,
    assetId: i.assetId,
    url: publicUrl(i.asset.storageKey),
    width: i.asset.width,
    height: i.asset.height,
    altSr: i.altSr,
    altEn: i.altEn,
    device: i.device,
    sortOrder: i.sortOrder,
  })),
  updatedAt: p.updatedAt.toISOString(),
})

const touched = () => {
  invalidate(CACHE_TAGS.PROJECTS, CACHE_TAGS.TESTIMONIALS)
}

export const listAdminProjects = async () =>
  (
    await prisma.project.findMany({
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      include: projectInclude,
    })
  ).map(serializeAdminProject)

export const getAdminProject = async (id: string) => {
  const project = await prisma.project.findUnique({ where: { id }, include: projectInclude })
  return project ? serializeAdminProject(project) : null
}

type ProjectData = z.output<typeof projectSchema>

/** JSON kolone traže `InputJsonValue`; zod je već proverio oblik. */
const jsonFields = (data: {
  metrics?: LocalizedMetric[] | undefined
  chapters?: LocalizedChapter[] | undefined
}) => ({
  ...(data.metrics ? { metrics: data.metrics as unknown as Prisma.InputJsonValue } : {}),
  ...(data.chapters ? { chapters: data.chapters as unknown as Prisma.InputJsonValue } : {}),
})

export const createProject = async (data: ProjectData) => {
  const { technologyIds, metrics: _m, chapters: _c, ...fields } = data
  const project = await prisma.project.create({
    data: {
      ...fields,
      ...jsonFields(data),
      // `sortOrder` u vezi čuva redosled kojim su tehnologije izabrane u formi
      technologies: {
        create: technologyIds.map((technologyId, sortOrder) => ({ technologyId, sortOrder })),
      },
    },
    include: projectInclude,
  })
  touched()
  return serializeAdminProject(project)
}

export const updateProject = async (id: string, data: z.output<typeof updateProjectSchema>) => {
  const { technologyIds, metrics: _m, chapters: _c, ...fields } = data
  const project = await prisma.$transaction(async (tx) => {
    if (technologyIds) {
      await tx.projectTechnology.deleteMany({ where: { projectId: id } })
      await tx.projectTechnology.createMany({
        data: technologyIds.map((technologyId, sortOrder) => ({
          projectId: id,
          technologyId,
          sortOrder,
        })),
      })
    }
    return tx.project.update({
      where: { id },
      data: { ...(fields as Prisma.ProjectUncheckedUpdateInput), ...jsonFields(data) },
      include: projectInclude,
    })
  })
  touched()
  return serializeAdminProject(project)
}

export const deleteProject = async (id: string) => {
  await prisma.project.delete({ where: { id } })
  touched()
}

export const reorderProjects = async (ids: string[]) => {
  await prisma.$transaction(
    orderUpdates(ids, (id, sortOrder) =>
      prisma.project.update({ where: { id }, data: { sortOrder } }),
    ),
  )
  touched()
}

export const attachProjectImage = async (
  projectId: string,
  data: z.output<typeof attachImageSchema>,
) => {
  const sortOrder = await prisma.projectImage.count({ where: { projectId } })
  const image = await prisma.projectImage.create({ data: { ...data, projectId, sortOrder } })
  touched()
  return { id: image.id }
}

export const updateProjectImage = async (
  imageId: string,
  data: z.output<typeof updateImageSchema>,
) => {
  await prisma.projectImage.update({
    where: { id: imageId },
    data: data as Prisma.ProjectImageUpdateInput,
  })
  touched()
}

export const deleteProjectImage = async (imageId: string) => {
  await prisma.projectImage.delete({ where: { id: imageId } })
  touched()
}

export const reorderProjectImages = async (ids: string[]) => {
  await prisma.$transaction(
    orderUpdates(ids, (id, sortOrder) =>
      prisma.projectImage.update({ where: { id }, data: { sortOrder } }),
    ),
  )
  touched()
}
