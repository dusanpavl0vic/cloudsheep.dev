import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { WorkItem } from '@/components/WorkItem'
import { FEATURED_PROJECTS } from '@/features/projects/projects.constants'
import { SECTION_IDS } from '@/lib/navigation'
import { ROUTES, projectPath } from '@/lib/routes'
import { SectionBlock, TextLink } from '@app/ui'

const WORK_INDEXES = ['/ 01', '/ 02', '/ 03']

export const WorkSection = () => {
  const { t } = useTranslation(['landing', 'common'])

  return (
    <SectionBlock
      id={SECTION_IDS.WORK}
      eyebrow={t('work.eyebrow')}
      title={t('work.title')}
      muted={t('work.titleMuted')}
      action={
        <TextLink asChild>
          <Link to={ROUTES.PROJECTS}>{t('work.allCases')} →</Link>
        </TextLink>
      }
    >
      <div className="flex flex-col gap-20">
        {FEATURED_PROJECTS.map((project, index) => (
          <WorkItem
            key={project.slug}
            index={WORK_INDEXES[index] ?? `/ ${String(index + 1).padStart(2, '0')}`}
            title={t(`projects.items.${project.key}.title`)}
            meta={`${project.year} · ${t(`projects.items.${project.key}.cat`)}`}
            description={t(`projects.items.${project.key}.desc`)}
            imageCaption={t(`projects.items.${project.key}.caption`)}
            tags={project.tech}
            to={projectPath(project.slug)}
            media={index % 2 === 0 ? 'start' : 'end'}
            action={
              <TextLink asChild className="mt-1">
                <Link to={projectPath(project.slug)}>{t('work.readCase')} →</Link>
              </TextLink>
            }
          />
        ))}
      </div>
    </SectionBlock>
  )
}
