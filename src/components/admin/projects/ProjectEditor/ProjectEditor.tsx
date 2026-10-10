'use client'

import NextLink from 'next/link'
import { useTranslations } from 'next-intl'

import ListStatus from '@/components/admin/ListStatus'
import PageHeader from '@/components/admin/PageHeader'
import Button from '@/components/buttons/Button'
import { projectHref, ROUTES } from '@/constants/routes'
import { useProjectEditor, useProjectPage } from '@/hooks/admin/projects'
import type { AdminProject } from '@/types/project'

import ProjectScreens from '../ProjectScreens'
import { ProjectBasics, ProjectChapters, ProjectMetrics, ProjectStack, ProjectStory } from '../ProjectSections'
import { Bar, Form } from './ProjectEditor.styles'

const ProjectForm = ({ project }: { project: AdminProject | undefined }) => {
  const t = useTranslations('admin')
  const api = useProjectEditor(project)

  return (
    <>
      <PageHeader
        title={t(api.isEdit ? 'projects.editTitle' : 'projects.newTitle')}
        actions={
          <>
            <Button href={ROUTES.ADMIN_PROJECTS} linkComponent={NextLink} variant="ghost" iconLeft="arrowLeft">
              {t('projects.back')}
            </Button>
            {project?.isPublished && (
              <Button href={projectHref(project.slug)} variant="secondary" iconRight="arrowUpRight">
                {t('projects.view')}
              </Button>
            )}
          </>
        }
      />
      <Form noValidate onSubmit={(event) => void api.submit(event)}>
        <ProjectBasics api={api} />
        <ProjectStory api={api} />
        <ProjectStack api={api} />
        <ProjectMetrics api={api} />
        <ProjectChapters api={api} />
        <Bar>
          <Button type="submit" size="l" loading={api.isSubmitting}>
            {t('common.save')}
          </Button>
        </Bar>
      </Form>
      <ProjectScreens project={project} />
    </>
  )
}

/** `/admin/projects/new` i `/admin/projects/[id]` — projekat i studija slučaja. */
const ProjectEditor = ({ projectId }: { projectId?: string }) => {
  const page = useProjectPage(projectId)
  return (
    <ListStatus isLoading={page.isLoading} isError={page.isError}>
      <ProjectForm key={page.project?.id ?? 'new'} project={page.project} />
    </ListStatus>
  )
}

export default ProjectEditor
