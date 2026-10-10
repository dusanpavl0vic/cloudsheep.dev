import 'server-only'

import type { Asset, Prisma, TeamMember as TeamMemberRow } from '@prisma/client'
import type { z } from 'zod'

import { CACHE_TAGS } from '@/constants/cache'
import type { Locale } from '@/constants/i18n'
import { pickLocalized } from '@/helpers/locale'
import type { cvSchema } from '@/schemas/cv'
import type { teamMemberSchema, updateTeamMemberSchema } from '@/schemas/team'
import type { AdminCv } from '@/types/cv'
import type { AdminTeamMember, TeamMember } from '@/types/team'

import { cached, invalidate } from '../cache'
import { cvInclude, orderUpdates, type MemberWithCv } from './includes'
import { localizeCv } from '../cv/localize'
import { renderCv } from '../cv/renderCv'
import { prisma } from '../db'
import { publicUrl } from '../uploads/storage'

const include = { avatar: true, seal: true } as const
const orderBy = { sortOrder: 'asc' } as const

type MemberWithAssets = TeamMemberRow & { avatar: Asset | null; seal: Asset | null }

const publicMember = (m: MemberWithAssets, locale: Locale): TeamMember => {
  const pick = (sr: string, en: string) => pickLocalized(locale, sr, en)
  return {
    id: m.id,
    fullName: m.fullName,
    role: pick(m.roleSr, m.roleEn),
    avatar: m.avatar
      ? {
          url: publicUrl(m.avatar.storageKey),
          width: m.avatar.width,
          height: m.avatar.height,
          alt: m.fullName,
        }
      : null,
    diploma: m.hasDiploma
      ? {
          university: pick(m.universitySr, m.universityEn),
          degree: pick(m.degreeSr, m.degreeEn),
          programme: pick(m.programmeSr, m.programmeEn),
          faculty: pick(m.facultySr, m.facultyEn),
          city: m.city,
          sealUrl: m.seal ? publicUrl(m.seal.storageKey) : null,
        }
      : null,
  }
}

const adminMember = (m: MemberWithAssets): AdminTeamMember => ({
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

/** Tim u sekciji Studio. */
export const listTeam = cached(
  async (locale: Locale) =>
    (await prisma.teamMember.findMany({ where: { isVisible: true }, orderBy, include })).map((m) =>
      publicMember(m, locale),
    ),
  'team',
  [CACHE_TAGS.TEAM],
)

export const listAdminTeam = async () =>
  (await prisma.teamMember.findMany({ orderBy, include })).map(adminMember)

export const createTeamMember = async (data: z.output<typeof teamMemberSchema>) => {
  const sortOrder = await prisma.teamMember.count()
  const member = await prisma.teamMember.create({ data: { ...data, sortOrder }, include })
  invalidate(CACHE_TAGS.TEAM)
  return adminMember(member)
}

export const updateTeamMember = async (
  id: string,
  data: z.output<typeof updateTeamMemberSchema>,
) => {
  const member = await prisma.teamMember.update({
    where: { id },
    data: data as Prisma.TeamMemberUncheckedUpdateInput,
    include,
  })
  invalidate(CACHE_TAGS.TEAM)
  return adminMember(member)
}

export const deleteTeamMember = async (id: string) => {
  await prisma.teamMember.delete({ where: { id } })
  invalidate(CACHE_TAGS.TEAM)
}

export const reorderTeam = async (ids: string[]) => {
  await prisma.$transaction(
    orderUpdates(ids, (id, sortOrder) =>
      prisma.teamMember.update({ where: { id }, data: { sortOrder } }),
    ),
  )
  invalidate(CACHE_TAGS.TEAM)
}

// ─── CV ───────────────────────────────────────────────────────────────────────────

/**
 * Admin oblik CV-a — RAVAN, jer puni formu. `sortOrder` se ne šalje: redosled je već primenjen
 * u `cvInclude`, pa je pozicija u nizu jedina istina.
 */
const adminCv = (m: MemberWithCv): AdminCv => ({
  memberId: m.id,
  fullName: m.fullName,
  roleSr: m.roleSr,
  roleEn: m.roleEn,
  email: m.email,
  phone: m.phone,
  githubUrl: m.githubUrl,
  linkedinUrl: m.linkedinUrl,
  websiteUrl: m.websiteUrl,
  locationSr: m.locationSr,
  locationEn: m.locationEn,
  summarySr: m.summarySr,
  summaryEn: m.summaryEn,
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
  educationStatusSr: m.educationStatusSr,
  educationStatusEn: m.educationStatusEn,
  gpa: m.gpa,
  educationStartYear: m.educationStartYear,
  educationEndYear: m.educationEndYear,
  experiences: m.cvExperiences.map((e) => ({
    company: e.company,
    positionSr: e.positionSr,
    positionEn: e.positionEn,
    locationSr: e.locationSr,
    locationEn: e.locationEn,
    startYear: e.startYear,
    startMonth: e.startMonth,
    endYear: e.endYear,
    endMonth: e.endMonth,
    summarySr: e.summarySr,
    summaryEn: e.summaryEn,
    bulletsSr: e.bulletsSr,
    bulletsEn: e.bulletsEn,
    technologies: e.technologies,
  })),
  siteProjects: m.cvSiteProjects.map((sp) => ({
    projectId: sp.projectId,
    title: sp.project.titleSr || sp.project.titleEn,
    year: sp.project.year,
    summary: sp.project.descSr || sp.project.descEn,
    technologies: sp.project.technologies.map((pt) => pt.technology.label),
    noteSr: sp.noteSr,
    noteEn: sp.noteEn,
  })),
  languages: m.cvLanguages.map((l) => ({
    nameSr: l.nameSr,
    nameEn: l.nameEn,
    levelSr: l.levelSr,
    levelEn: l.levelEn,
  })),
})

const findWithCv = (id: string) =>
  prisma.teamMember.findUnique({ where: { id }, include: cvInclude })

export const getCv = async (memberId: string) => {
  const member = await findWithCv(memberId)
  return member ? adminCv(member) : null
}

/** Zamena celog CV-a u jednoj transakciji — poslati redosled JESTE redosled u dokumentu. */
export const saveCv = async (memberId: string, input: z.output<typeof cvSchema>) => {
  const { siteProjects, experiences, languages, ...fields } = input
  const member = await prisma.$transaction(async (tx) => {
    await tx.teamMember.update({ where: { id: memberId }, data: fields })
    await tx.cvSiteProject.deleteMany({ where: { memberId } })
    await tx.cvExperience.deleteMany({ where: { memberId } })
    await tx.cvLanguage.deleteMany({ where: { memberId } })
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
  })
  invalidate(CACHE_TAGS.TEAM)
  return adminCv(member)
}

/** PDF CV-a i ime fajla bez dijakritika (`Dusan-Pavlovic-CV-sr.pdf`). */
export const renderCvPdf = async (memberId: string, lang: 'sr' | 'en') => {
  const member = await findWithCv(memberId)
  if (!member) return null

  const slug =
    member.fullName
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '') || 'cv'

  return { pdf: await renderCv(localizeCv(member, lang), lang), filename: `${slug}-CV-${lang}.pdf` }
}
