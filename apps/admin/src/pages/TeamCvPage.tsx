import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'

import { useProjects } from '@/features/projects'
import { CvForm, useCv } from '@/features/team'
import { ROUTES } from '@/lib/routes'
import { PageHeader, Spinner, TextLink } from '@app/ui'

/**
 * Uređivanje CV-a jednog člana tima.
 *
 * Stranica je samo ožičenje: `useCv` nosi učitavanje, čuvanje i preuzimanje, `CvForm` crta.
 * Ista podela kao `ProjectEditPage` — strana ne zna ništa o obliku podataka.
 *
 * `id` iz rute se ne proverava: ruta bez njega ne postoji, a nepostojećeg člana server
 * odbija sa 404. Provera ovde bi bila drugo mesto koje isto zna.
 */
export const TeamCvPage = () => {
  const { t } = useTranslation(['cv', 'common'])
  const { id = '' } = useParams()
  const { cv, values, save, download, isLoading, isSaving, isDownloading } = useCv(id)
  // Projekti sa sajta se dohvataju OVDE: `features/team` ne sme da uvozi `features/projects`,
  // a strana sme oba (docs/01 §2). Otud i prolaze kroz props, a ne kroz hook u formi.
  const { projects, isLoading: projectsLoading } = useProjects()

  if (isLoading || projectsLoading) return <Spinner label={t('common:common.loading')} />

  return (
    <>
      <PageHeader
        eyebrow={cv?.fullName ?? ''}
        title={t('cv.title')}
        subtitle={t('cv.subtitle')}
        className="mb-8"
      />

      <p className="mb-6">
        <TextLink asChild>
          <Link to={ROUTES.TEAM}>← {t('cv.back')}</Link>
        </TextLink>
      </p>

      <CvForm
        values={values}
        siteProjects={projects.map((p) => ({
          id: p.id,
          title: p.titleSr || p.titleEn,
          year: p.year,
        }))}
        isSaving={isSaving}
        isDownloading={isDownloading}
        onSubmit={save}
        onDownload={(lang) => void download(lang)}
      />
    </>
  )
}
