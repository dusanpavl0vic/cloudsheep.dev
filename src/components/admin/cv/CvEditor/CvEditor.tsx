'use client'

import NextLink from 'next/link'
import { useTranslations } from 'next-intl'

import ListStatus from '@/components/admin/ListStatus'
import PageHeader from '@/components/admin/PageHeader'
import Button from '@/components/buttons/Button'
import { ROUTES } from '@/constants/routes'
import { useCvForm, useCvPage } from '@/hooks/admin/team'
import type { AdminCv } from '@/types/cv'

import CvExperience from '../CvExperience'
import { CvLanguages, CvProjects } from '../CvLists'
import { CvContactSection, CvEducationSection } from '../CvSections'
import { Bar, Form } from './CvEditor.styles'

/** Forma — renderuje se tek sa učitanim CV-om, da podrazumevane vrednosti budu tačne. */
const CvForm = ({ cv }: { cv: AdminCv }) => {
  const t = useTranslations('admin')
  const api = useCvForm(cv)

  return (
    <>
      <PageHeader
        title={t('cv.title', { name: cv.fullName })}
        actions={
          <>
            <Button href={ROUTES.ADMIN_TEAM} linkComponent={NextLink} variant="ghost" iconLeft="arrowLeft">
              {t('cv.back')}
            </Button>
            {(['sr', 'en'] as const).map((lang) => (
              <Button key={lang} variant="secondary" iconLeft="download" loading={api.isDownloading} onClick={() => void api.downloadPdf(lang)}>
                {t('cv.download', { lang: lang.toUpperCase() })}
              </Button>
            ))}
          </>
        }
      />
      <Form noValidate onSubmit={(event) => void api.submit(event)}>
        <CvContactSection api={api} />
        <CvEducationSection api={api} />
        <CvExperience api={api} />
        <CvProjects api={api} />
        <CvLanguages api={api} />
        <Bar>
          <Button type="submit" size="l" loading={api.isSubmitting}>
            {t('common.save')}
          </Button>
        </Bar>
      </Form>
    </>
  )
}

/** `/admin/team/[memberId]/cv` — CV člana tima i PDF na oba jezika. */
const CvEditor = ({ memberId }: { memberId: string }) => {
  const page = useCvPage(memberId)
  return (
    <ListStatus isLoading={page.isLoading} isError={page.isError}>
      {page.cv && <CvForm cv={page.cv} />}
    </ListStatus>
  )
}

export default CvEditor
