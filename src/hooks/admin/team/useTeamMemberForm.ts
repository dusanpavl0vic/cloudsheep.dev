'use client'

import { useState } from 'react'
import { useWatch } from 'react-hook-form'

import { teamMemberSchema } from '@/schemas/team'
import { useCreateTeamMemberMutation, useGetTeamQuery, useUpdateTeamMemberMutation } from '@/store/api/admin/team'
import type { Asset } from '@/types/media'
import type { AdminTeamMember } from '@/types/team'

import { useAdminForm } from '../useAdminForm'

const TEXT_FIELDS = [
  'fullName',
  'roleSr',
  'roleEn',
  'universitySr',
  'universityEn',
  'degreeSr',
  'degreeEn',
  'programmeSr',
  'programmeEn',
  'facultySr',
  'facultyEn',
  'city',
] as const

const defaultsOf = (member: AdminTeamMember | undefined) => ({
  ...Object.fromEntries(TEXT_FIELDS.map((field) => [field, member?.[field] ?? ''])),
  avatarId: member?.avatarId ?? null,
  sealId: member?.sealId ?? null,
  hasDiploma: member?.hasDiploma ?? false,
  isVisible: member?.isVisible ?? true,
})

/** Dijalog člana tima: ime, uloga, fotografija, vidljivost; diploma tek kad je čekirana. */
export const useTeamMemberForm = (id: string | undefined, onSaved: () => void) => {
  const { member } = useGetTeamQuery(undefined, { selectFromResult: ({ data }) => ({ member: data?.find((item) => item.id === id) }) })
  const [create] = useCreateTeamMemberMutation()
  const [update] = useUpdateTeamMemberMutation()
  const [images, setImages] = useState({ avatar: member?.avatarUrl ?? null, seal: member?.sealUrl ?? null })

  const admin = useAdminForm({
    schema: teamMemberSchema,
    defaultValues: defaultsOf(member),
    save: (values) => (member ? update({ id: member.id, patch: values }).unwrap() : create(values).unwrap()),
    onSaved,
  })
  // `useWatch`, ne `form.watch` — Compiler bi memoizovao rezultat.
  const hasDiploma = useWatch({ control: admin.form.control, name: 'hasDiploma' })

  const setImage = (key: 'avatar' | 'seal') => (asset: Asset | null) => {
    setImages((current) => ({ ...current, [key]: asset?.url ?? null }))
    admin.form.setValue(key === 'avatar' ? 'avatarId' : 'sealId', asset?.id ?? null, { shouldDirty: true })
  }

  return { ...admin, isEdit: Boolean(member), hasDiploma, images, setAvatar: setImage('avatar'), setSeal: setImage('seal') }
}
