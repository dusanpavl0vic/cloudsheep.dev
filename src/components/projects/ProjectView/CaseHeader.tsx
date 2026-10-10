import { useTranslations } from 'next-intl'

import CountUp from '@/components/data-display/CountUp'
import TextLink from '@/components/navigation/TextLink'
import { ROUTES } from '@/constants/routes'
import type { ProjectDetail } from '@/types/project'

import { Meta, Metric, Metrics, Summary, Title } from './CaseHeader.styles'

/** Vrh studije: nazad, kategorija · klijent · godina, naslov, sažetak, metrike. */
const CaseHeader = ({ project }: { project: ProjectDetail }) => {
  const t = useTranslations('projects')

  return (
    <>
      <TextLink href={ROUTES.PROJECTS} iconLeft="arrowLeft" icon={null} tone="muted">
        {t('caseStudy.back')}
      </TextLink>
      <Meta>{[t(`categories.${project.category}`), project.client, project.year].filter(Boolean).join(' · ')}</Meta>
      <Title>{project.title}</Title>
      <Summary>{project.description}</Summary>
      {project.metrics.length > 0 && (
        <Metrics aria-label={t('caseStudy.results')}>
          {project.metrics.map((metric) => (
            <Metric key={metric.label}>
              <dt>{metric.label}</dt>
              <dd>
                <CountUp value={metric.value} />
              </dd>
            </Metric>
          ))}
        </Metrics>
      )}
    </>
  )
}

export default CaseHeader
