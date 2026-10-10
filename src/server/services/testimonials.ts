import 'server-only'

import type { Asset, Prisma, Project, Testimonial as TestimonialRow } from '@prisma/client'
import type { z } from 'zod'

import { CACHE_TAGS } from '@/constants/cache'
import type { Locale } from '@/constants/i18n'
import { pickLocalized } from '@/helpers/locale'
import type { testimonialSchema, updateTestimonialSchema } from '@/schemas/testimonial'
import type { AdminTestimonial, Testimonial } from '@/types/testimonial'

import { cached, invalidate } from '../cache'
import { prisma } from '../db'
import { orderUpdates } from './includes'
import { publicUrl } from '../uploads/storage'

type Row = TestimonialRow & { avatar: Asset | null; project: Project | null }

const include = { avatar: true, project: true } as const

const serialize = (t: Row, locale: Locale): Testimonial => ({
  id: t.id,
  quote: pickLocalized(locale, t.quoteSr, t.quoteEn),
  authorName: t.authorName,
  authorRole: pickLocalized(locale, t.authorRoleSr, t.authorRoleEn),
  company: t.company,
  avatar: t.avatar
    ? {
        url: publicUrl(t.avatar.storageKey),
        width: t.avatar.width,
        height: t.avatar.height,
        alt: t.authorName,
      }
    : null,
  // Link samo ka OBJAVLJENOM projektu — skica ne sme da procuri kroz utisak.
  project: t.project?.isPublished
    ? { slug: t.project.slug, title: pickLocalized(locale, t.project.titleSr, t.project.titleEn) }
    : null,
})

export const listTestimonials = cached(
  async (locale: Locale) =>
    (
      await prisma.testimonial.findMany({
        where: { isPublished: true },
        orderBy: { sortOrder: 'asc' },
        include,
      })
    ).map((t) => serialize(t, locale)),
  'testimonials',
  [CACHE_TAGS.TESTIMONIALS],
)

const adminTestimonial = (t: Row): AdminTestimonial => ({
  id: t.id,
  quoteSr: t.quoteSr,
  quoteEn: t.quoteEn,
  authorName: t.authorName,
  authorRoleSr: t.authorRoleSr,
  authorRoleEn: t.authorRoleEn,
  company: t.company,
  avatarId: t.avatarId,
  avatarUrl: t.avatar ? publicUrl(t.avatar.storageKey) : null,
  projectId: t.projectId,
  sortOrder: t.sortOrder,
  isPublished: t.isPublished,
})

export const listAdminTestimonials = async () =>
  (await prisma.testimonial.findMany({ orderBy: { sortOrder: 'asc' }, include })).map(
    adminTestimonial,
  )

export const createTestimonial = async (data: z.output<typeof testimonialSchema>) => {
  const sortOrder = await prisma.testimonial.count()
  const testimonial = await prisma.testimonial.create({ data: { ...data, sortOrder }, include })
  invalidate(CACHE_TAGS.TESTIMONIALS)
  return adminTestimonial(testimonial)
}

export const updateTestimonial = async (
  id: string,
  data: z.output<typeof updateTestimonialSchema>,
) => {
  const testimonial = await prisma.testimonial.update({
    where: { id },
    data: data as Prisma.TestimonialUncheckedUpdateInput,
    include,
  })
  invalidate(CACHE_TAGS.TESTIMONIALS)
  return adminTestimonial(testimonial)
}

export const deleteTestimonial = async (id: string) => {
  await prisma.testimonial.delete({ where: { id } })
  invalidate(CACHE_TAGS.TESTIMONIALS)
}

export const reorderTestimonials = async (ids: string[]) => {
  await prisma.$transaction(
    orderUpdates(ids, (id, sortOrder) =>
      prisma.testimonial.update({ where: { id }, data: { sortOrder } }),
    ),
  )
  invalidate(CACHE_TAGS.TESTIMONIALS)
}
