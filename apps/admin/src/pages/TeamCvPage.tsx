import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'

import { CvForm } from '@/features/team'
import { useCv } from '@/features/team'
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

  if (isLoading) return <Spinner label={t('common:common.loading')} />

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
        isSaving={isSaving}
        isDownloading={isDownloading}
        onSubmit={save}
        onDownload={(lang) => void download(lang)}
      />
    </>
  )
}
