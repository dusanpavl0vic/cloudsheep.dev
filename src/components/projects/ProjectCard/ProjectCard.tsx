import { useTranslations } from 'next-intl'

import Tag from '@/components/data-display/Tag'
import Cover from '@/components/media/Cover'
import { EFFECT_ATTRS } from '@/constants/effects'
import { projectHref } from '@/constants/routes'
import type { ProjectSummary } from '@/types/project'

import { Body, Meta, Root, Summary, Tags, Title, TitleLink } from './ProjectCard.styles'

interface ProjectCardProps {
  project: ProjectSummary
  /** Prve kartice su iznad fold-a — slika se ne učitava lenjo. */
  eager?: boolean
}

/** Kartica u listi projekata: slika, kategorija · godina, naslov (link), sažetak, stack. */
const ProjectCard = ({ project, eager = false }: ProjectCardProps) => {
  const t = useTranslations('projects')

  return (
    <Root {...{ [EFFECT_ATTRS.reveal]: '' }}>
      <Cover image={project.cover} fallbackAlt={t('coverAlt', { title: project.title })} eager={eager} />
      <Body>
        <Meta>
          <span>{project.tagline || t(`categories.${project.category}`)}</span>
          <span>{project.year}</span>
        </Meta>
        <Title>
          <TitleLink href={projectHref(project.slug)}>{project.title}</TitleLink>
        </Title>
        <Summary>{project.description}</Summary>
        {project.technologies.length > 0 && (
          <Tags>
            {project.technologies.map((tech) => (
              <li key={tech.id}>
                <Tag variant="soft" iconUrl={tech.logoUrl}>
                  {tech.label}
                </Tag>
              </li>
            ))}
          </Tags>
        )}
      </Body>
    </Root>
  )
}

export default ProjectCard
