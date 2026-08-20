import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { SkeletonList } from '@/components/Skeleton'
import { ProjectsTable, useDeleteProject, useProjectOrder, useProjects } from '@/features/projects'
import { ROUTES } from '@/lib/routes'
import { Button, EmptyState, PageHeader } from '@app/ui'

/** Stranica je SAMO kompozicija — nema state, nema selektora (docs/02). */
export function ProjectsPage() {
  const { t } = useTranslation(['projects', 'common'])
  const { projects, isLoading, error } = useProjects()
  const { remove, isLoading: isDeleting } = useDeleteProject()
  const { move, toggleFeatured, togglePublished, isBusy } = useProjectOrder()

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-4">
        <PageHeader title={t('projects.title')} subtitle={t('projects.subtitle')} />
        <Button asChild>
          <Link to={ROUTES.PROJECT_NEW}>{t('projects.new')}</Link>
        </Button>
      </div>

      {isLoading && <SkeletonList rows={5} label={t('projects.loading')} />}

      {error && <p role="alert">{t('projects.loadError')}</p>}

      {!isLoading && !error && projects.length === 0 && (
        <EmptyState
          title={t('projects.empty.title')}
          description={t('projects.empty.body')}
          action={
            <Button asChild>
              <Link to={ROUTES.PROJECT_NEW}>{t('projects.empty.action')}</Link>
            </Button>
          }
        />
      )}

      {projects.length > 0 && (
        <ProjectsTable
          projects={projects}
          isDeleting={isDeleting}
          isBusy={isBusy}
          onMove={(index, direction) => {
            move(projects, index, direction)
          }}
          onToggleFeatured={toggleFeatured}
          onTogglePublished={togglePublished}
          onDelete={(project) => {
            void remove(project.id, project.titleSr)
          }}
        />
      )}
    </>
  )
}
