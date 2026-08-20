import { useTranslation } from 'react-i18next'
import { useLoaderData } from 'react-router'

import { ProjectCard, useProjectFilter, type Project } from '@/features/projects'
import { PROJECT_CATEGORIES } from '@/features/projects'
import { Container, PageHeader, Reveal, cn } from '@app/ui'

const filterButtonClass = (active: boolean) =>
  cn(
    'rounded-full border px-4 py-1.5 text-[13.5px] font-semibold transition-colors',
    active
      ? 'border-foreground bg-foreground text-background'
      : 'border-border-strong text-muted-foreground hover:border-foreground hover:text-foreground',
  )

export const ProjectsPage = () => {
  const { t } = useTranslation(['projects', 'common'])
  const projects = useLoaderData<Project[]>()
  const { active, visible, setCategory } = useProjectFilter(projects)

  return (
    <>
      <Container width="content" className="pt-20 pb-10">
        <Reveal>
          <PageHeader
            eyebrow={t('projects.eyebrow')}
            title={t('projects.title')}
            subtitle={t('projects.subtitle')}
          />
        </Reveal>
      </Container>

      <div className="border-border bg-background/86 sticky top-[71px] z-50 border-y backdrop-blur-md">
        <Container width="content" className="flex flex-wrap gap-2.5 py-3.5">
          {PROJECT_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={category === active}
              onClick={() => {
                setCategory(category)
              }}
              className={filterButtonClass(category === active)}
            >
              {t(`projects.filters.${category}`)}
            </button>
          ))}
        </Container>
      </div>

      <Container width="content" className="pt-12 pb-24">
        {visible.length > 0 ? (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((project) => (
              <Reveal key={project.slug} className="h-full">
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-faint py-20 text-center font-mono text-sm">{t('projects.empty')}</p>
        )}
      </Container>
    </>
  )
}
