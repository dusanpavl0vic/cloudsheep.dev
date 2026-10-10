'use client'

import { useLocale } from 'next-intl'
import type { ArrayPath, FieldArray } from 'react-hook-form'

import { cvToForm, toCvInput } from '@/helpers/cv'
import { saveObjectUrl } from '@/helpers/download'
import { cvFormSchema, type CvForm } from '@/schemas/cv'
import { useGetProjectsQuery } from '@/store/api/admin/projects'
import { useDownloadCvPdfMutation, useGetCvQuery, useSaveCvMutation } from '@/store/api/admin/team'
import type { AdminCv } from '@/types/cv'

import { useAdminAction } from '../useAdminAction'
import { useAdminForm } from '../useAdminForm'
import { useFormList } from '../useFormList'

/** Forma CV-a; renderuje se tek kad CV stigne, pa su podrazumevane vrednosti tačne. */
export const useCvForm = (cv: AdminCv) => {
  const locale = useLocale()
  const [save] = useSaveCvMutation()
  const [download, { isLoading: isDownloading }] = useDownloadCvPdfMutation()
  const { run } = useAdminAction()
  const { projects } = useGetProjectsQuery(undefined, {
    selectFromResult: ({ data }) => ({
      projects: (data ?? []).map((project) => ({ value: project.id, label: locale === 'sr' ? project.titleSr : project.titleEn })),
    }),
  })

  const admin = useAdminForm({
    schema: cvFormSchema,
    defaultValues: cvToForm(cv),
    save: (values) => save({ memberId: cv.memberId, cv: toCvInput(values) }).unwrap(),
  })

  return {
    ...admin,
    projects,
    isDownloading,
    downloadPdf: async (lang: 'sr' | 'en') => {
      const pdf = await run(() => download({ memberId: cv.memberId, lang }).unwrap())
      if (pdf) saveObjectUrl(pdf, `${cv.fullName.replace(/\s+/g, '-')}-CV-${lang}.pdf`)
    },
  }
}

export type CvFormApi = ReturnType<typeof useCvForm>

type CvList = Extract<ArrayPath<CvForm>, 'experiences' | 'siteProjects' | 'languages'>

/** Ponavljajuća grupa CV-a (pozicije, projekti, jezici): stavke, dodaj praznu, ukloni. */
export const useCvList = <N extends CvList>(api: CvFormApi, name: N, empty: FieldArray<CvForm, N>) => {
  const list = useFormList<CvForm, unknown, FieldArray<CvForm, N>>({ control: api.form.control, setValue: api.form.setValue, name })
  return {
    items: list.items,
    add: () => {
      list.add(empty)
    },
    remove: list.remove,
  }
}

/** CV za stranicu editora (učitavanje i greška pre forme). */
export const useCvPage = (memberId: string) => {
  const query = useGetCvQuery(memberId)
  return { cv: query.data, isLoading: query.isLoading, isError: query.isError }
}
