import type { Asset, Prisma, TeamMember } from '@prisma/client'
import { Router } from 'express'

import { prisma } from '../db.ts'
import { withPrismaErrors } from '../lib/prismaError.ts'
import { publicUrl } from '../lib/uploads.ts'
import { requireAuth, requireRole } from '../middleware/auth.ts'
import { HttpError } from '../middleware/error.ts'
import { reorderSchema } from '../schemas/project.schema.ts'
import { teamMemberSchema, updateTeamMemberSchema } from '../schemas/team.schema.ts'

export const teamRouter: Router = Router()

const include = { avatar: true, seal: true } as const
const orderBy = { sortOrder: 'asc' } as const

type MemberWithAssets = TeamMember & { avatar: Asset | null; seal: Asset | null }

/**
 * Javni oblik: dvojezična polja grupisana, adrese slika gotove.
 *
 * Podaci o diplomi se **izostavljaju u celosti** kad `hasDiploma` nije uključen. Slanje
 * praznih stringova bi značilo da frontend mora da pogađa da li ima šta da prikaže; ovako
 * je odsustvo `diploma` polja jednoznačan odgovor.
 */
const publicMember = (m: MemberWithAssets) => ({
  id: m.id,
  fullName: m.fullName,
  role: { sr: m.roleSr, en: m.roleEn },
  avatar: m.avatar
    ? { url: publicUrl(m.avatar.storageKey), width: m.avatar.width, height: m.avatar.height }
    : null,
  diploma: m.hasDiploma
    ? {
        university: { sr: m.universitySr, en: m.universityEn },
        degree: { sr: m.degreeSr, en: m.degreeEn },
        programme: { sr: m.programmeSr, en: m.programmeEn },
        faculty: { sr: m.facultySr, en: m.facultyEn },
        city: m.city,
        sealUrl: m.seal ? publicUrl(m.seal.storageKey) : null,
      }
    : null,
})

/** Admin oblik je RAVAN, jer puni formu — isto razdvajanje kao kod projekata. */
const adminMember = (m: MemberWithAssets) => ({
  id: m.id,
  fullName: m.fullName,
  roleSr: m.roleSr,
  roleEn: m.roleEn,
  avatarId: m.avatarId,
  avatarUrl: m.avatar ? publicUrl(m.avatar.storageKey) : null,
  hasDiploma: m.hasDiploma,
  universitySr: m.universitySr,
  universityEn: m.universityEn,
  degreeSr: m.degreeSr,
  degreeEn: m.degreeEn,
  programmeSr: m.programmeSr,
  programmeEn: m.programmeEn,
  facultySr: m.facultySr,
  facultyEn: m.facultyEn,
  city: m.city,
  sealId: m.sealId,
  sealUrl: m.seal ? publicUrl(m.seal.storageKey) : null,
  sortOrder: m.sortOrder,
  isVisible: m.isVisible,
})

teamRouter.get('/team', async (_req, res) => {
  const members = await prisma.teamMember.findMany({
    where: { isVisible: true },
    orderBy,
    include,
  })

  res.json({ items: members.map(publicMember) })
})

const adminRouter: Router = Router()
adminRouter.use(requireAuth, requireRole('admin'))

adminRouter.get('/team', async (_req, res) => {
  const members = await prisma.teamMember.findMany({ orderBy, include })

  res.json({ items: members.map(adminMember) })
})

adminRouter.post('/team', async (req, res) => {
  const parsed = teamMemberSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'team.errors.invalid')

  const count = await prisma.teamMember.count()
  const member = await withPrismaErrors(() =>
    prisma.teamMember.create({ data: { ...parsed.data, sortOrder: count }, include }),
  )

  res.status(201).json(adminMember(member))
})

// `/order` MORA pre `/:id` — inače bi „order" bio pročitan kao id člana.
adminRouter.patch('/team/order', async (req, res) => {
  const parsed = reorderSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'team.errors.invalid')

  await prisma.$transaction(
    parsed.data.ids.map((id, index) =>
      prisma.teamMember.update({ where: { id }, data: { sortOrder: index } }),
    ),
  )

  res.status(204).end()
})

adminRouter.patch('/team/:id', async (req, res) => {
  const parsed = updateTeamMemberSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'team.errors.invalid')

  const member = await withPrismaErrors(() =>
    prisma.teamMember.update({
      where: { id: req.params.id },
      data: parsed.data as Prisma.TeamMemberUpdateInput,
      include,
    }),
  )

  res.json(adminMember(member))
})

adminRouter.delete('/team/:id', async (req, res) => {
  await withPrismaErrors(() => prisma.teamMember.delete({ where: { id: req.params.id } }))

  res.status(204).end()
})

teamRouter.use('/admin', adminRouter)
