'use client'

import { useState } from 'react'

import { technologyFormSchema } from '@/schemas/technology'
import { useCreateTechnologyMutation, useGetTechnologiesQuery, useUpdateTechnologyMutation } from '@/store/api/admin/technologies'
import type { Asset } from '@/types/media'

import { useAdminForm } from '../useAdminForm'

/** Dijalog tehnologije: `id` — izmena postojeće, bez njega — nova. */
export const useTechnologyForm = (id: string | undefined, onSaved: () => void) => {
  const { technology } = useGetTechnologiesQuery(undefined, {
    selectFromResult: ({ data }) => ({ technology: data?.find((item) => item.id === id) }),
  })
  const [create] = useCreateTechnologyMutation()
  const [update] = useUpdateTechnologyMutation()
  // Pregled logotipa: URL dolazi uz otpremljenu sliku, a forma čuva samo njen id.
  const [logoUrl, setLogoUrl] = useState(technology?.logoUrl ?? null)

  const admin = useAdminForm({
    schema: technologyFormSchema,
    defaultValues: {
      slug: technology?.slug ?? '',
      label: technology?.label ?? '',
      group: technology?.group ?? 'tooling',
      logoId: technology?.logoId ?? null,
    },
    save: (values) => (technology ? update({ id: technology.id, patch: values }).unwrap() : create(values).unwrap()),
    onSaved,
  })

  return {
    ...admin,
    isEdit: Boolean(technology),
    logoUrl,
    setLogo: (asset: Asset | null) => {
      setLogoUrl(asset?.url ?? null)
      admin.form.setValue('logoId', asset?.id ?? null, { shouldDirty: true })
    },
  }
}
