'use client'

import NextLink from 'next/link'
import { useTranslations } from 'next-intl'

import Badge from '@/components/admin/Badge'
import DataTable, { type DataColumn } from '@/components/admin/DataTable'
import ListStatus from '@/components/admin/ListStatus'
import OrderButtons from '@/components/admin/OrderButtons'
import PageHeader from '@/components/admin/PageHeader'
import RowActions from '@/components/admin/RowActions'
import Button from '@/components/buttons/Button'
import { adminProjectHref, ROUTES } from '@/constants/routes'
import { useProjects } from '@/hooks/admin/projects'

import { Title, Toggles, Year } from './ProjectsView.styles'

type ProjectRow = ReturnType<typeof useProjects>['items'][number]

/** `/admin/projects` — radovi u redosledu sa sajta. */
const ProjectsView = () => {
  const t = useTranslations()
  const projects = useProjects()

  const columns: DataColumn<ProjectRow>[] = [
    {
      key: 'order',
      header: '#',
      cell: (project) => {
        const index = projects.items.indexOf(project)
        return (
          <OrderButtons
            name={project.title}
            canUp={projects.order.canMove(index, -1)}
            canDown={projects.order.canMove(index, 1)}
            onMove={(delta) => {
              projects.order.move(index, delta)
            }}
          />
        )
      },
    },
    {
      key: 'title',
      header: t('admin.projects.titleEn'),
      cell: (project) => (
        <NextLink href={adminProjectHref(project.id)}>
          <Title>
            {project.cover ? <img src={project.cover} alt="" /> : <i />}
            {project.title}
          </Title>
        </NextLink>
      ),
    },
    { key: 'year', header: t('admin.projects.year'), wide: true, cell: (project) => <Year>{project.year}</Year> },
    { key: 'category', header: t('admin.projects.category'), wide: true, cell: (project) => <Badge>{t(`projects.categories.${project.category}`)}</Badge> },
    {
      key: 'status',
      header: t('admin.newsletter.status'),
      cell: (project) => (
        <Toggles>
          <Button variant="ghost" size="s" aria-pressed={project.isPublished} onClick={() => void projects.toggle(project, 'isPublished')}>
            <Badge tone={project.isPublished ? 'success' : 'neutral'}>{t(project.isPublished ? 'admin.common.published' : 'admin.common.draft')}</Badge>
          </Button>
          <Button variant="ghost" size="s" aria-pressed={project.isFeatured} aria-label={t('admin.projects.featured')} onClick={() => void projects.toggle(project, 'isFeatured')}>
            <Badge tone={project.isFeatured ? 'accent' : 'neutral'}>{t('admin.projects.featuredShort')}</Badge>
          </Button>
        </Toggles>
      ),
    },
    {
      key: 'actions',
      header: t('admin.common.actions'),
      align: 'right',
      cell: (project) => <RowActions name={project.title} onDelete={() => void projects.remove(project)} />,
    },
  ]

  return (
    <>
      <PageHeader
        title={t('admin.nav.projects')}
        lead={t('admin.projects.lead')}
        actions={
          <Button href={ROUTES.ADMIN_PROJECT_NEW} linkComponent={NextLink} iconLeft="plus">
            {t('admin.projects.add')}
          </Button>
        }
      />
      <ListStatus isLoading={projects.isLoading} isError={projects.isError}>
        <DataTable rows={projects.items} columns={columns} rowKey={(project) => project.id} empty={t('admin.common.empty')} caption={t('admin.nav.projects')} />
      </ListStatus>
    </>
  )
}

export default ProjectsView
