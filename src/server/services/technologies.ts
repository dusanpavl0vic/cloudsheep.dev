import 'server-only'

import type { Prisma } from '@prisma/client'
import type { z } from 'zod'

import { CACHE_TAGS } from '@/constants/cache'
import type { technologySchema, updateTechnologySchema } from '@/schemas/technology'
import type { AdminTechnology, Technology, TechnologyGroup } from '@/types/technology'

import { cached, invalidate } from '../cache'
import { prisma } from '../db'
import { orderUpdates, type TechnologyWithLogo } from './includes'
import { publicUrl } from '../uploads/storage'

export const serializeTechnology = (t: TechnologyWithLogo): Technology => ({
  id: t.id,
  slug: t.slug,
  label: t.label,
  group: t.group as TechnologyGroup,
  logoUrl: t.logo ? publicUrl(t.logo.storageKey) : null,
})

const adminTechnology = (t: TechnologyWithLogo): AdminTechnology => ({
  ...serializeTechnology(t),
  logoId: t.logoId,
  sortOrder: t.sortOrder,
})

const orderBy = [
  { sortOrder: 'asc' },
  { label: 'asc' },
] satisfies Prisma.TechnologyOrderByWithRelationInput[]

/** Stack sekcija na početnoj. */
export const listTechnologies = cached(
  async () =>
    (await prisma.technology.findMany({ orderBy, include: { logo: true } })).map(
      serializeTechnology,
    ),
  'technologies',
  [CACHE_TAGS.TECHNOLOGIES],
)

export const listAdminTechnologies = async () =>
  (await prisma.technology.findMany({ orderBy, include: { logo: true } })).map(adminTechnology)

/** Projekti nose tehnologije, pa izmena tehnologije menja i njih. */
const touched = () => {
  invalidate(CACHE_TAGS.TECHNOLOGIES, CACHE_TAGS.PROJECTS)
}

export const createTechnology = async (data: z.output<typeof technologySchema>) => {
  const sortOrder = await prisma.technology.count()
  const technology = await prisma.technology.create({
    data: { ...data, sortOrder },
    include: { logo: true },
  })
  touched()
  return adminTechnology(technology)
}

export const updateTechnology = async (
  id: string,
  data: z.output<typeof updateTechnologySchema>,
) => {
  const technology = await prisma.technology.update({
    where: { id },
    data: data as Prisma.TechnologyUncheckedUpdateInput,
    include: { logo: true },
  })
  touched()
  return adminTechnology(technology)
}

export const deleteTechnology = async (id: string) => {
  await prisma.technology.delete({ where: { id } })
  touched()
}

export const reorderTechnologies = async (ids: string[]) => {
  await prisma.$transaction(
    orderUpdates(ids, (id, sortOrder) =>
      prisma.technology.update({ where: { id }, data: { sortOrder } }),
    ),
  )
  touched()
}
