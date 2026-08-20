import type { Prisma } from '@prisma/client'
import { Router } from 'express'

import { prisma } from '../db.ts'
import { withPrismaErrors } from '../lib/prismaError.ts'
import { publicTechnology } from '../lib/serialize.ts'
import { requireAuth, requireRole } from '../middleware/auth.ts'
import { HttpError } from '../middleware/error.ts'
import { reorderSchema } from '../schemas/project.schema.ts'
import { createTechnologySchema, updateTechnologySchema } from '../schemas/technology.schema.ts'

export const technologiesRouter: Router = Router()

const include = { logo: true } as const
const orderBy = [{ sortOrder: 'asc' as const }, { label: 'asc' as const }]

/**
 * Javni spisak tehnologija.
 *
 * Sajt ga koristi za sekciju „Stack". Ranije je to bio niz od 16 stavki u `lib/tech.ts`
 * uz skriptu koja je proveravala da svaka ima SVG na disku — dakle nova tehnologija se
 * nije mogla dodati bez izmene koda.
 */
technologiesRouter.get('/technologies', async (_req, res) => {
  const items = await prisma.technology.findMany({ include, orderBy })

  res.json({ items: items.map(publicTechnology) })
})

const adminRouter: Router = Router()
adminRouter.use(requireAuth, requireRole('admin'))

adminRouter.get('/technologies', async (_req, res) => {
  const items = await prisma.technology.findMany({ include, orderBy })

  res.json({ items: items.map(publicTechnology) })
})

adminRouter.post('/technologies', async (req, res) => {
  const parsed = createTechnologySchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'technologies.errors.invalid')

  const technology = await withPrismaErrors(() =>
    prisma.technology.create({ data: parsed.data, include }),
  )

  res.status(201).json(publicTechnology(technology))
})

// `/order` MORA pre `/:id` — inače bi „order" bio pročitan kao id tehnologije.
adminRouter.patch('/technologies/order', async (req, res) => {
  const parsed = reorderSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'technologies.errors.invalid')

  await prisma.$transaction(
    parsed.data.ids.map((id, index) =>
      prisma.technology.update({ where: { id }, data: { sortOrder: index } }),
    ),
  )

  res.status(204).end()
})

adminRouter.patch('/technologies/:id', async (req, res) => {
  const parsed = updateTechnologySchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'technologies.errors.invalid')

  const technology = await withPrismaErrors(() =>
    prisma.technology.update({
      where: { id: req.params.id },
      data: parsed.data as Prisma.TechnologyUpdateInput,
      include,
    }),
  )

  res.json(publicTechnology(technology))
})

/**
 * Brisanje uklanja i veze ka projektima (`onDelete: Cascade`).
 *
 * To je namerno: tehnologija koja ne postoji ne sme da ostane zakačena za projekat kao
 * prazna pločica. Admin panel pre brisanja pokaže na koliko projekata je zakačena.
 */
adminRouter.delete('/technologies/:id', async (req, res) => {
  await withPrismaErrors(() => prisma.technology.delete({ where: { id: req.params.id } }))

  res.status(204).end()
})

technologiesRouter.use('/admin', adminRouter)
