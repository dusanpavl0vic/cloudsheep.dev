import 'server-only'

import type { Prisma } from '@prisma/client'
import type { z } from 'zod'

import { CACHE_TAGS } from '@/constants/cache'
import type { Locale } from '@/constants/i18n'
import { pickLocalized } from '@/helpers/locale'
import type { profileSchema, socialLinkSchema, updateSocialLinkSchema } from '@/schemas/profile'
import type { AdminProfile, AdminSocialLink, SiteProfile } from '@/types/profile'

import { cached, invalidate } from '../cache'
import { prisma } from '../db'
import { orderUpdates } from './includes'

/** Singleton — uvek isti id, pa drugi red ne može ni da nastane. */
const PROFILE_ID = 'singleton'

/**
 * Profil i vidljivi linkovi zajedno: sajt ih uvek prikazuje zajedno (podnožje, Studio).
 * Prazan profil NIJE greška — sajt prikazuje ono što ima.
 */
export const getSiteProfile = cached(
  async (locale: Locale): Promise<SiteProfile> => {
    const [profile, links] = await Promise.all([
      prisma.profile.findUnique({ where: { id: PROFILE_ID } }),
      prisma.socialLink.findMany({ where: { isVisible: true }, orderBy: { sortOrder: 'asc' } }),
    ])
    return {
      profile: profile
        ? {
            fullName: profile.fullName,
            location: profile.location,
            isAvailable: profile.isAvailable,
            headline: pickLocalized(locale, profile.headlineSr, profile.headlineEn),
            bio: pickLocalized(locale, profile.bioSr, profile.bioEn),
          }
        : null,
      links: links.map(({ id, platform, url, label }) => ({ id, platform, url, label })),
    }
  },
  'site-profile',
  [CACHE_TAGS.PROFILE],
)

const adminLink = (l: {
  id: string
  platform: string
  url: string
  label: string
  isVisible: boolean
  sortOrder: number
}): AdminSocialLink => ({
  id: l.id,
  platform: l.platform,
  url: l.url,
  label: l.label,
  isVisible: l.isVisible,
  sortOrder: l.sortOrder,
})

export const getAdminProfile = async (): Promise<{
  profile: AdminProfile | null
  links: AdminSocialLink[]
}> => {
  const [profile, links] = await Promise.all([
    prisma.profile.findUnique({ where: { id: PROFILE_ID } }),
    prisma.socialLink.findMany({ orderBy: { sortOrder: 'asc' } }),
  ])
  if (!profile) return { profile: null, links: links.map(adminLink) }
  const { id: _id, updatedAt: _updatedAt, ...fields } = profile
  return { profile: fields, links: links.map(adminLink) }
}

export const updateProfile = async (data: z.output<typeof profileSchema>) => {
  await prisma.profile.upsert({
    where: { id: PROFILE_ID },
    update: data,
    create: { id: PROFILE_ID, ...data },
  })
  invalidate(CACHE_TAGS.PROFILE)
  return getAdminProfile()
}

export const createSocialLink = async (data: z.output<typeof socialLinkSchema>) => {
  const sortOrder = await prisma.socialLink.count()
  const link = await prisma.socialLink.create({ data: { ...data, sortOrder } })
  invalidate(CACHE_TAGS.PROFILE)
  return adminLink(link)
}

export const updateSocialLink = async (
  id: string,
  data: z.output<typeof updateSocialLinkSchema>,
) => {
  const link = await prisma.socialLink.update({
    where: { id },
    data: data as Prisma.SocialLinkUpdateInput,
  })
  invalidate(CACHE_TAGS.PROFILE)
  return adminLink(link)
}

export const deleteSocialLink = async (id: string) => {
  await prisma.socialLink.delete({ where: { id } })
  invalidate(CACHE_TAGS.PROFILE)
}

export const reorderSocialLinks = async (ids: string[]) => {
  await prisma.$transaction(
    orderUpdates(ids, (id, sortOrder) =>
      prisma.socialLink.update({ where: { id }, data: { sortOrder } }),
    ),
  )
  invalidate(CACHE_TAGS.PROFILE)
}
