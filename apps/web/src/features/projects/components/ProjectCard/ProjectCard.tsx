import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { SheepMark } from '@/components/Logo'
import type { Project } from '@/features/projects/projects.constants'
import { projectPath } from '@/lib/routes'
import { techTags } from '@/lib/tech'
import { TagList } from '@app/ui'

import {
  projectBodyVariants,
  projectCardVariants,
  projectCatVariants,
  projectDescVariants,
  projectMediaVariants,
  projectTitleVariants,
  projectYearVariants,
} from './ProjectCard.variants'

interface ProjectCardProps {
  project: Project
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { t } = useTranslation(['projects', 'common'])
  const base = `projects.items.${project.key}`

  return (
    <Link to={projectPath(project.slug)} className={projectCardVariants()}>
      <div className={projectMediaVariants()}>
        <SheepMark aria-hidden className="text-primary/40 size-9" />
      </div>
      <div className={projectBodyVariants()}>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className={projectTitleVariants()}>{t(`${base}.title`)}</h3>
          <span className={projectYearVariants()}>{project.year}</span>
        </div>
        <div className={projectCatVariants()}>{t(`${base}.cat`)}</div>
        <p className={projectDescVariants()}>{t(`${base}.desc`)}</p>
        <TagList
          tags={techTags(project.tech)}
          variant="logo"
          size="bare"
          font="sans"
          className="mt-2.5"
        />
      </div>
    </Link>
  )
}
