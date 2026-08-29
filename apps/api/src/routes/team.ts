import type { Asset, Prisma, TeamMember } from '@prisma/client'
import { Router } from 'express'

import { prisma } from '../db.ts'
import { localizeCv } from '../lib/cv/localize.ts'
import { renderCv } from '../lib/cv/renderCv.ts'
import { withPrismaErrors } from '../lib/prismaError.ts'
import { adminCv, cvInclude } from '../lib/serialize.ts'
import { publicUrl } from '../lib/uploads.ts'
import { requireAuth, requireRole } from '../middleware/auth.ts'
import { HttpError } from '../middleware/error.ts'
import { cvSchema } from '../schemas/cv.schema.ts'
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

// ── CV ────────────────────────────────────────────────────────────────────────────
//
// Sve tri rute stoje ISPOD `/team/:id`, ali imaju svoj segment posle njega, pa ih Express
// razlikuje bez obzira na redosled — za razliku od `/team/order`, koje bi bez pažnje bilo
// pročitano kao id.

adminRouter.get('/team/:id/cv', async (req, res) => {
  const member = await prisma.teamMember.findUnique({
    where: { id: req.params.id },
    include: cvInclude,
  })
  if (!member) throw new HttpError(404, 'errors.notFound')

  res.json(adminCv(member))
})

/**
 * Ceo CV u jednom telu, umesto CRUD-a po kolekciji.
 *
 * Četiri kolekcije se ZAMENJUJU u celini, u jednoj transakciji — isti obrazac koji
 * `projects.ts` koristi za tehnologije projekta. Redosled je deo podatka, a pozicija u
 * poslatom nizu ga nosi; šesnaest ruta koje bi održavale `sortOrder` po redu rešava isti
 * problem uz mnogo više površine za greške.
 *
 * Cena je da dva admina koja istovremeno uređuju isti CV pišu jedan preko drugog. Uz
 * jednog korisnika to nije slučaj koji postoji.
 */
adminRouter.put('/team/:id/cv', async (req, res) => {
  const parsed = cvSchema.safeParse(req.body)
  if (!parsed.success) throw new HttpError(400, 'cv.errors.invalid')

  const { siteProjects, experiences, languages, ...fields } = parsed.data
  const memberId = req.params.id

  const member = await withPrismaErrors(() =>
    prisma.$transaction(async (tx) => {
      await tx.teamMember.update({ where: { id: memberId }, data: fields })

      await tx.cvSiteProject.deleteMany({ where: { memberId } })
      await tx.cvExperience.deleteMany({ where: { memberId } })
      await tx.cvLanguage.deleteMany({ where: { memberId } })

      // `sortOrder` iz indeksa: poslati redosled JESTE redosled u dokumentu.
      if (siteProjects.length > 0) {
        await tx.cvSiteProject.createMany({
          data: siteProjects.map((sp, sortOrder) => ({ ...sp, memberId, sortOrder })),
        })
      }
      if (experiences.length > 0) {
        await tx.cvExperience.createMany({
          data: experiences.map((e, sortOrder) => ({ ...e, memberId, sortOrder })),
        })
      }
      if (languages.length > 0) {
        await tx.cvLanguage.createMany({
          data: languages.map((l, sortOrder) => ({ ...l, memberId, sortOrder })),
        })
      }

      return tx.teamMember.findUniqueOrThrow({ where: { id: memberId }, include: cvInclude })
    }),
  )

  res.json(adminCv(member))
})

/**
 * Gotov PDF.
 *
 * `.pdf` je u putanji, ne samo u `Content-Type`: pretraživač i alati koji čuvaju odgovor
 * iz adresne linije tako dobiju ispravnu ekstenziju čak i kad zaglavlje promakne.
 */
adminRouter.get('/team/:id/cv.pdf', async (req, res) => {
  const lang = req.query.lang === 'en' ? 'en' : 'sr'

  const member = await prisma.teamMember.findUnique({
    where: { id: req.params.id },
    include: cvInclude,
  })
  if (!member) throw new HttpError(404, 'errors.notFound')

  const pdf = await renderCv(localizeCv(member, lang), lang)

  /*
   * Ime datoteke se svodi na ASCII.
   *
   * `Content-Disposition` je po RFC-u latin-1, pa „Dušan Pavlović" ovde postaje niz upitnika
   * ili obara zaglavlje. Puno ime i dalje stoji U dokumentu (`info.Title`); ovo je samo
   * predlog imena za snimanje.
   */
  const slug =
    member.fullName
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'cv'

  res.setHeader('Content-Type', 'application/pdf')
  res.setHeader('Content-Length', pdf.length)
  res.setHeader('Content-Disposition', `attachment; filename="${slug}-CV-${lang}.pdf"`)
  res.send(pdf)
})

teamRouter.use('/admin', adminRouter)
