import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router'

import { SkeletonForm } from '@/components/Skeleton'
import { ProjectForm, useProjectForm } from '@/features/projects'
import { useTechnologies } from '@/features/technologies'
import { ROUTES } from '@/lib/routes'
import { PageHeader } from '@app/ui'

/**
 * Ista stranica i za novi i za postojeći projekat — razlika je samo postojanje `:id`.
 *
 * Stranica je SAMO kompozicija (docs/02): odluku šta se šalje serveru donosi
 * `useProjectForm`, a kuda se ide posle čuvanja odlučuje ovde, jer je to ruta.
 */
export function ProjectEditPage() {
  const { t } = useTranslation('projects')
  const { id } = useParams()
  const navigate = useNavigate()

  const { project, save, isLoading, isSaving } = useProjectForm(id)
  // Spisak za izbor tehnologija; forma ne zna odakle dolazi
  const { technologies } = useTechnologies()

  const goToList = () => {
    void navigate(ROUTES.PROJECTS)
  }

  if (isLoading) return <SkeletonForm fields={8} label={t('projects.loading')} />

  return (
    <>
      <PageHeader className="mb-8" title={id ? t('projects.editTitle') : t('projects.newTitle')} />

      <ProjectForm
        {...(project ? { project } : {})}
        availableTechnologies={technologies}
        isSaving={isSaving}
        onCancel={goToList}
        onSubmit={async (values) => {
          const result = await save(values)
          if (result.ok) goToList()
          return result
        }}
      />
    </>
  )
}
