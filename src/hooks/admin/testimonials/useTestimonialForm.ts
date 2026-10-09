'use client'

import { useLocale } from 'next-intl'
import { useState } from 'react'

import { testimonialSchema } from '@/schemas/testimonial'
import { useGetProjectsQuery } from '@/store/api/admin/projects'
import { useCreateTestimonialMutation, useGetTestimonialsQuery, useUpdateTestimonialMutation } from '@/store/api/admin/testimonials'
import type { Asset } from '@/types/media'

import { useAdminForm } from '../useAdminForm'

/** Dijalog utiska: citat i uloga na oba jezika, fotografija, opcioni projekat. */
export const useTestimonialForm = (id: string | undefined, onSaved: () => void) => {
  const locale = useLocale()
  const { testimonial } = useGetTestimonialsQuery(undefined, {
    selectFromResult: ({ data }) => ({ testimonial: data?.find((item) => item.id === id) }),
  })
  const { projects } = useGetProjectsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      projects: (data ?? []).map((project) => ({ value: project.id, label: locale === 'sr' ? project.titleSr : project.titleEn })),
    }),
  })
  const [create] = useCreateTestimonialMutation()
  const [update] = useUpdateTestimonialMutation()
  const [avatarUrl, setAvatarUrl] = useState(testimonial?.avatarUrl ?? null)

  const admin = useAdminForm({
    schema: testimonialSchema,
    defaultValues: {
      quoteSr: testimonial?.quoteSr ?? '',
      quoteEn: testimonial?.quoteEn ?? '',
      authorName: testimonial?.authorName ?? '',
      authorRoleSr: testimonial?.authorRoleSr ?? '',
      authorRoleEn: testimonial?.authorRoleEn ?? '',
      company: testimonial?.company ?? '',
      avatarId: testimonial?.avatarId ?? null,
      projectId: testimonial?.projectId ?? null,
      isPublished: testimonial?.isPublished ?? false,
    },
    save: (values) => (testimonial ? update({ id: testimonial.id, patch: values }).unwrap() : create(values).unwrap()),
    onSaved,
  })

  return {
    ...admin,
    isEdit: Boolean(testimonial),
    projects,
    avatarUrl,
    setAvatar: (asset: Asset | null) => {
      setAvatarUrl(asset?.url ?? null)
      admin.form.setValue('avatarId', asset?.id ?? null, { shouldDirty: true })
    },
  }
}
