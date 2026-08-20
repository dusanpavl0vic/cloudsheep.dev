import type { Prisma } from '@prisma/client'
import { Router } from 'express'

import { prisma } from '../db.ts'
import { withPrismaErrors } from '../lib/prismaError.ts'
import { requireAuth, requireRole } from '../middleware/auth.ts'
import { HttpError } from '../middleware/error.ts'
import {
  profileSchema,
  socialLinkSchema,
  updateSocialLinkSchema,
} from '../schemas/profile.schema.ts'
import { reorderSchema } from '../schemas/project.schema.ts'

export const profileRouter: Router = Router()

/** Singleton — uvek isti id, pa drugi red ne može ni da nastane. */
const PROFILE_ID = 'singleton'

const localized = (sr: string, en: string) => ({ sr, en })

const serializeProfile = (p: {
  fullName: string
  location: string
  isAvailable: boolean
  headlineSr: string
  headlineEn: string
  bioSr: string
  bioEn: string
  universitySr: string
  universityEn: string
  degreeSr: string
  degreeEn: string
}) => ({
  fullName: p.fullName,
  location: p.location,
  isAvailable: p.isAvailable,
  headline: localized(p.headlineSr, p.headlineEn),
  bio: localized(p.bioSr, p.bioEn),
  university: localized(p.universitySr, p.universityEn),
  degree: localized(p.degreeSr, p.degreeEn),
})

/**
 * Javni profil sa vidljivim linkovima.
 *
 * Jedan zahtev, ne dva: sajt ih uvek prikazuje zajedno (podnožje i sekcija „Studio"),
 * pa bi razdvajanje značilo dva kruga do servera za isti ekran.
 */
profileRouter.get('/profile', async (_req, res) => {
  const [profile, links] = await Promise.all([
    prisma.profile.findUnique({ where: { id: PROFILE_ID } }),
    prisma.socialLink.findMany({ where: { isVisible: true }, orderBy: { sortOrder: 'asc' } }),
  ])

  // Prazan profil NIJE greška — sajt tada prikazuje ono što ima (docs/15: bez praznih rupa)
  res.json({
    profile: profile ? serializeProfile(profile) : null,
    links: links.map((l) => ({ id: l.id, platform: l.platform, url: l.url, label: l.label })),
  })
})

const adminRouter: Router = Router()
adminRouter.use(requireAuth, requireRole('admin'))

adminRouter.get('/profile', async (_req, res) => {
  const [profile, links] = await Promise.all([
    prisma.profile.findUnique({ where: { id: PROFILE_ID } }),
    prisma.socialLink.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])

  // Admin dobija RAVAN oblik, jer puni formu — isto razdvajanje kao kod projekata
  res.json({ profile, links })
})

adminRouter.put('/profile', async (req, res) => {
  const parsed = profileSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'profile.errors.invalid')

  const profile = await withPrismaErrors(() =>
    prisma.profile.upsert({
      where: { id: PROFILE_ID },
      update: parsed.data,
      create: { id: PROFILE_ID, ...parsed.data },
    }),
  )

  res.json(profile)
})

adminRouter.post('/social-links', async (req, res) => {
  const parsed = socialLinkSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'profile.errors.invalid')

  const count = await prisma.socialLink.count()
  const link = await withPrismaErrors(() =>
    prisma.socialLink.create({ data: { ...parsed.data, sortOrder: count } }),
  )

  res.status(201).json(link)
})

// `/order` MORA pre `/:id` — inače bi „order" bio pročitan kao id linka.
adminRouter.patch('/social-links/order', async (req, res) => {
  const parsed = reorderSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'profile.errors.invalid')

  await prisma.$transaction(
    parsed.data.ids.map((id, index) =>
      prisma.socialLink.update({ where: { id }, data: { sortOrder: index } }),
    ),
  )

  res.status(204).end()
})

adminRouter.patch('/social-links/:id', async (req, res) => {
  const parsed = updateSocialLinkSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'profile.errors.invalid')

  const link = await withPrismaErrors(() =>
    prisma.socialLink.update({
      where: { id: req.params.id },
      data: parsed.data as Prisma.SocialLinkUpdateInput,
    }),
  )

  res.json(link)
})

adminRouter.delete('/social-links/:id', async (req, res) => {
  await withPrismaErrors(() => prisma.socialLink.delete({ where: { id: req.params.id } }))

  res.status(204).end()
})

profileRouter.use('/admin', adminRouter)
