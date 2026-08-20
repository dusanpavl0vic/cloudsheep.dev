import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { projectEditPath } from '@/lib/routes'
import {
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@app/ui'

import { rowActionsVariants, statusBadgeVariants } from './ProjectsTable.variants'
import type { AdminProject } from '../../types'

interface ProjectsTableProps {
  projects: readonly AdminProject[]
  onDelete: (project: AdminProject) => void
  /** Pomeranje za jedno mesto; ceo novi poredak sastavlja hook, ne komponenta. */
  onMove: (index: number, direction: -1 | 1) => void
  onToggleFeatured: (project: AdminProject) => void
  onTogglePublished: (project: AdminProject) => void
  isDeleting: boolean
  /** Redosled ili prekidač su u toku — dugmad se zaključavaju da se upisi ne preklope. */
  isBusy: boolean
}

/**
 * Lista projekata. Bez sortiranja i paginacije — nad desetak redova to je rad koji niko
 * ne traži, a `docs/07 §5` virtualizaciju traži tek preko 100 redova.
 *
 * Komponenta ne zna za store: podatke i radnje dobija kroz props, od feature hook-a.
 */
export const ProjectsTable = ({
  projects,
  onDelete,
  onMove,
  onToggleFeatured,
  onTogglePublished,
  isDeleting,
  isBusy,
}: ProjectsTableProps) => {
  const { t } = useTranslation(['projects', 'common'])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('projects.reorder.title')}</TableHead>
          <TableHead>{t('projects.table.title')}</TableHead>
          <TableHead>{t('projects.table.category')}</TableHead>
          <TableHead>{t('projects.table.year')}</TableHead>
          <TableHead>{t('projects.table.status')}</TableHead>
          <TableHead>{t('projects.reorder.featured')}</TableHead>
          <TableHead className="text-end">{t('projects.table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {projects.map((project, index) => (
          <TableRow key={project.id}>
            <TableCell>
              {/* Strelice, ne prevlačenje mišem: prevlačenje ne radi tastaturom, a lista
                  ima desetak redova. `docs/15` traži da svaka radnja bude dostupna. */}
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={index === 0 || isBusy}
                  aria-label={t('projects.reorder.up')}
                  onClick={() => {
                    onMove(index, -1)
                  }}
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={index === projects.length - 1 || isBusy}
                  aria-label={t('projects.reorder.down')}
                  onClick={() => {
                    onMove(index, 1)
                  }}
                >
                  ↓
                </Button>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-foreground font-semibold">{project.titleSr}</span>
              <span className="text-muted-foreground block text-[13px]">{project.slug}</span>
            </TableCell>
            <TableCell>{t(`projects.categories.${project.category}`)}</TableCell>
            <TableCell>{project.year}</TableCell>
            <TableCell>
              {/* Objavljivanje bez ulaska u formu — najčešća radnja u panelu */}
              <button
                type="button"
                disabled={isBusy}
                className={statusBadgeVariants({ published: project.isPublished })}
                onClick={() => {
                  onTogglePublished(project)
                }}
              >
                {project.isPublished ? t('projects.status.published') : t('projects.status.draft')}
              </button>
            </TableCell>
            <TableCell>
              <Checkbox
                checked={project.isFeatured}
                disabled={isBusy}
                aria-label={t('projects.reorder.featured')}
                onChange={() => {
                  onToggleFeatured(project)
                }}
              />
            </TableCell>
            <TableCell>
              <div className={rowActionsVariants()}>
                <Button asChild variant="ghost" size="sm">
                  <Link to={projectEditPath(project.id)}>{t('common:common.edit')}</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() => {
                    onDelete(project)
                  }}
                >
                  {t('common:common.delete')}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
