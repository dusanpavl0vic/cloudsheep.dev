import { useTranslations } from 'next-intl'

import CountUp from '@/components/data-display/CountUp'
import Tag from '@/components/data-display/Tag'
import VisuallyHidden from '@/components/foundations/VisuallyHidden'
import Cover from '@/components/media/Cover'
import TextLink from '@/components/navigation/TextLink'
import { EFFECT_ATTRS } from '@/constants/effects'
import { projectHref } from '@/constants/routes'
import { ordinal } from '@/helpers/projects'
import type { ProjectSummary } from '@/types/project'

import { Body, CoverLink, Index, Media, Meta, Metric, MetricLabel, MetricValue, Row, Summary, Tags, Title } from './Work.styles'

interface FeaturedProjectProps {
  project: ProjectSummary
  index: number
}

/** Istaknut projekat na početnoj: slika, meta, naslov, sažetak, glavna metrika, stack, link. */
const FeaturedProject = ({ project, index }: FeaturedProjectProps) => {
  const t = useTranslations()
  const href = projectHref(project.slug)

  return (
    <Row {...{ [EFFECT_ATTRS.reveal]: '' }}>
      <Media $flip={index % 2 === 1}>
        <CoverLink href={href} tabIndex={-1} aria-hidden="true">
          <Cover image={project.cover} fallbackAlt={t('projects.coverAlt', { title: project.title })} radius={18} />
        </CoverLink>
      </Media>
      <Body>
        <Meta>
          <Index>{ordinal(index)}</Index>
          <span>
            {project.year} · {t(`projects.categories.${project.category}`)}
          </span>
        </Meta>
        <Title>{project.title}</Title>
        <Summary>{project.description}</Summary>
        {project.metric && (
          <Metric>
            <MetricValue>
              <CountUp value={project.metric.value} />
            </MetricValue>
            <MetricLabel>{project.metric.label}</MetricLabel>
          </Metric>
        )}
        {project.technologies.length > 0 && (
          <Tags>
            {project.technologies.map((tech) => (
              <li key={tech.id}>
                <Tag variant="outline" iconUrl={tech.logoUrl}>
                  {tech.label}
                </Tag>
              </li>
            ))}
          </Tags>
        )}
        <TextLink href={href}>
          {t('home.work.readCase')}
          <VisuallyHidden>{`: ${project.title}`}</VisuallyHidden>
        </TextLink>
      </Body>
    </Row>
  )
}

export default FeaturedProject
