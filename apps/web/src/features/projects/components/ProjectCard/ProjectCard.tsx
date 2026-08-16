import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { SpiralMark } from '@/components/Logo'
import { TagList } from '@/components/TagList'
import { projectPath } from '@/constants/routes'
import type { Project } from '@/features/projects/projects.constants'

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
  const { t } = useTranslation()
  const base = `projects.items.${project.key}`

  return (
    <Link to={projectPath(project.slug)} className={projectCardVariants()}>
      <div className={projectMediaVariants()}>
        <SpiralMark aria-hidden className="size-9 text-primary/40" />
      </div>
      <div className={projectBodyVariants()}>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className={projectTitleVariants()}>{t(`${base}.title`)}</h3>
          <span className={projectYearVariants()}>{project.year}</span>
        </div>
        <div className={projectCatVariants()}>{t(`${base}.cat`)}</div>
        <p className={projectDescVariants()}>{t(`${base}.desc`)}</p>
        <TagList tags={project.tech} variant="outline" font="sans" size="sm" className="mt-1.5" />
      </div>
    </Link>
  )
}
