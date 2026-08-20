import type { Prisma } from '@prisma/client'
import { Router } from 'express'

import { prisma } from '../db.ts'
import { withPrismaErrors } from '../lib/prismaError.ts'
import { adminProject, projectInclude, publicProject } from '../lib/serialize.ts'
import { requireAuth, requireRole } from '../middleware/auth.ts'
import { HttpError } from '../middleware/error.ts'
import {
  attachImageSchema,
  createProjectSchema,
  reorderSchema,
  updateImageSchema,
  updateProjectSchema,
} from '../schemas/project.schema.ts'

export const projectsRouter: Router = Router()

/**
 * Prazan string iz forme znači „nema linka" — u bazi je to `null`, ne `''`.
 *
 * `| undefined` u ograničenju je obavezno zbog `exactOptionalPropertyTypes`: kod izmene
 * telo je delimično, pa polje sme i da izostane, a bez toga se `Partial` tip ne uklapa.
 */
const emptyToNull = <
  T extends { liveUrl?: string | null | undefined; repoUrl?: string | null | undefined },
>(
  data: T,
): T => ({
  ...data,
  ...(data.liveUrl === '' ? { liveUrl: null } : {}),
  ...(data.repoUrl === '' ? { repoUrl: null } : {}),
})

// ── Javno ───────────────────────────────────────────────────────────────────────

/**
 * Lista objavljenih projekata, oba jezika.
 *
 * Filtriranje po kategoriji NIJE ovde: sajt ima desetak projekata i sve ih ionako učitava
 * za landing stranu, pa je filtriranje na klijentu jedan zahtev manje i trenutna promena
 * filtera. Kad ih bude stotinu, ovde ide `?category=`.
 */
projectsRouter.get('/projects', async (_req, res) => {
  const projects = await prisma.project.findMany({
    where: { isPublished: true },
    orderBy: [{ sortOrder: 'asc' }, { year: 'desc' }],
    include: projectInclude,
  })

  res.json({ items: projects.map(publicProject) })
})

projectsRouter.get('/projects/:slug', async (req, res) => {
  const project = await prisma.project.findFirst({
    where: { slug: req.params.slug, isPublished: true },
    include: projectInclude,
  })

  if (!project) throw new HttpError(404, 'errors.notFound')

  res.json(publicProject(project))
})

// ── Admin ───────────────────────────────────────────────────────────────────────

const adminRouter: Router = Router()

/*
 * Zaštita na nivou router-a, ne po ruti.
 *
 * Po ruti bi značilo da se nova ruta može dodati bez nje, i da se to ne vidi u pregledu
 * koda — propušten `requireAuth` izgleda kao red koji prosto nije tu.
 */
adminRouter.use(requireAuth, requireRole('admin'))

adminRouter.get('/projects', async (_req, res) => {
  const projects = await prisma.project.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    include: projectInclude,
  })

  res.json({ items: projects.map(adminProject) })
})

adminRouter.get('/projects/:id', async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: projectInclude,
  })
  if (!project) throw new HttpError(404, 'errors.notFound')

  res.json(adminProject(project))
})

adminRouter.post('/projects', async (req, res) => {
  const parsed = createProjectSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'projects.errors.invalid')

  const { technologyIds, ...fields } = parsed.data

  const project = await withPrismaErrors(() =>
    prisma.project.create({
      data: {
        ...emptyToNull(fields),
        // `sortOrder` u vezi čuva redosled kojim su tehnologije izabrane u formi
        technologies: {
          create: technologyIds.map((id, i) => ({ technologyId: id, sortOrder: i })),
        },
      },
      include: projectInclude,
    }),
  )

  res.status(201).json(adminProject(project))
})

adminRouter.patch('/projects/order', async (req, res) => {
  const parsed = reorderSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'projects.errors.invalid')

  /*
   * Transakcija, ne petlja pojedinačnih upisa.
   *
   * Bez nje prekid usred prevlačenja ostavlja pola liste u novom, pola u starom redosledu —
   * stanje koje korisnik ne može ni da vidi ni da popravi bez ponovnog prevlačenja svega.
   */
  await prisma.$transaction(
    parsed.data.ids.map((id, index) =>
      prisma.project.update({ where: { id }, data: { sortOrder: index } }),
    ),
  )

  res.status(204).end()
})

adminRouter.patch('/projects/:id', async (req, res) => {
  const parsed = updateProjectSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'projects.errors.invalid')

  /*
   * Tvrdnja tipa je nužna, i evo zašto je bezbedna.
   *
   * `updateProjectSchema` je `.partial()`, pa je njegov TIP `{ slug?: string | undefined }`.
   * Uz `exactOptionalPropertyTypes` Prisma takav tip odbija, jer ona pravi razliku između
   * „ključ ne postoji" i „ključ postoji sa vrednošću undefined" — drugo bi značilo upis
   * `NULL`. U praksi te razlike nema: zod pri `safeParse` izostavlja ključeve kojih nema u
   * telu zahteva, umesto da ih doda kao `undefined`.
   */
  const { technologyIds, ...fields } = parsed.data
  const data = emptyToNull(fields) as Prisma.ProjectUpdateInput

  /*
   * Tehnologije se zamenjuju u celosti, ne dopunjuju.
   *
   * Forma šalje konačan spisak; `deleteMany` + `create` je jedini način da se i UKLANJANJE
   * tehnologije prenese. Diff po pojedinačnoj vezi bio bi više koda za isti ishod nad
   * spiskom od najviše dvanaest stavki.
   */
  const project = await withPrismaErrors(() =>
    prisma.$transaction(async (tx) => {
      if (technologyIds) {
        await tx.projectTechnology.deleteMany({ where: { projectId: req.params.id } })
        await tx.projectTechnology.createMany({
          data: technologyIds.map((id, i) => ({
            projectId: req.params.id,
            technologyId: id,
            sortOrder: i,
          })),
        })
      }

      return tx.project.update({
        where: { id: req.params.id },
        data,
        include: projectInclude,
      })
    }),
  )

  res.json(adminProject(project))
})

adminRouter.delete('/projects/:id', async (req, res) => {
  await withPrismaErrors(() => prisma.project.delete({ where: { id: req.params.id } }))

  res.status(204).end()
})

// ── Slike projekta ──────────────────────────────────────────────────────────────

/*
 * Slike su zasebni endpointi, ne polje u telu projekta.
 *
 * Otpremanje je već zaseban korak (`POST /admin/uploads` vraća `assetId`), pa bi guranje
 * celog spiska kroz `PATCH /projects/:id` značilo da se pri svakom čuvanju forme šalju i
 * slike koje niko nije dirao.
 */
adminRouter.post('/projects/:id/images', async (req, res) => {
  const parsed = attachImageSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'projects.errors.invalid')

  const count = await prisma.projectImage.count({ where: { projectId: req.params.id } })

  const image = await withPrismaErrors(() =>
    prisma.projectImage.create({
      data: { ...parsed.data, projectId: req.params.id, sortOrder: count },
      include: { asset: true },
    }),
  )

  res.status(201).json({ id: image.id })
})

// `/order` MORA pre `/:imageId` — inače bi „order" bio pročitan kao id slike.
adminRouter.patch('/projects/:id/images/order', async (req, res) => {
  const parsed = reorderSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'projects.errors.invalid')

  await prisma.$transaction(
    parsed.data.ids.map((id, index) =>
      prisma.projectImage.update({ where: { id }, data: { sortOrder: index } }),
    ),
  )

  res.status(204).end()
})

adminRouter.patch('/projects/:id/images/:imageId', async (req, res) => {
  const parsed = updateImageSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'projects.errors.invalid')

  await withPrismaErrors(() =>
    prisma.projectImage.update({
      where: { id: req.params.imageId },
      data: parsed.data as Prisma.ProjectImageUpdateInput,
    }),
  )

  res.status(204).end()
})

adminRouter.delete('/projects/:id/images/:imageId', async (req, res) => {
  await withPrismaErrors(() => prisma.projectImage.delete({ where: { id: req.params.imageId } }))

  res.status(204).end()
})

projectsRouter.use('/admin', adminRouter)
