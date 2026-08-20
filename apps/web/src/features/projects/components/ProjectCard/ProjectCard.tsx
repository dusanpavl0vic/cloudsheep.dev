import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { SheepMark } from '@/components/Logo'
import { projectPath } from '@/lib/routes'

import {
  projectBodyVariants,
  projectCardVariants,
  projectCatVariants,
  projectDescVariants,
  projectMediaVariants,
  projectTitleVariants,
  projectYearVariants,
} from './ProjectCard.variants'
import { localize } from '../../lib/localize'
import type { Project } from '../../types'
import { TechTags } from '../TechTags'

interface ProjectCardProps {
  project: Project
}

/**
 * Tekst više ne dolazi iz i18n ključeva nego iz samog projekta — sadržaj je podatak,
 * a `t()` ostaje za ono što je deo interfejsa (labele filtera, prazno stanje).
 */
export const ProjectCard = ({ project }: ProjectCardProps) => {
  const { i18n } = useTranslation('projects')

  // Prva slika je naslovna. `galleryLayout: 'none'` znači da projekat namerno nema medije.
  const cover = project.galleryLayout === 'none' ? undefined : project.images[0]

  return (
    <Link to={projectPath(project.slug)} className={projectCardVariants()}>
      <div className={projectMediaVariants()}>
        {cover ? (
          <img
            src={cover.url}
            alt={localize(cover.alt, i18n.language)}
            width={cover.width}
            height={cover.height}
            loading="lazy"
            decoding="async"
            className="size-full object-cover"
          />
        ) : (
          // Projekat bez slike i dalje ima karticu — ovčica je čuvar mesta, ne greška
          <SheepMark aria-hidden className="text-primary/40 size-9" />
        )}
      </div>
      <div className={projectBodyVariants()}>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className={projectTitleVariants()}>{localize(project.title, i18n.language)}</h3>
          <span className={projectYearVariants()}>{project.year}</span>
        </div>
        <div className={projectCatVariants()}>{localize(project.cat, i18n.language)}</div>
        <p className={projectDescVariants()}>{localize(project.desc, i18n.language)}</p>
        <TechTags technologies={project.technologies} className="mt-2.5" />
      </div>
    </Link>
  )
}
