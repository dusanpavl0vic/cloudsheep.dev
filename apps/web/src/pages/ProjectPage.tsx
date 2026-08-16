import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'

import { SheepMark } from '@/components/Logo'
import {
  CASE_STUDY_HIGHLIGHTS,
  CASE_STUDY_SECTIONS,
  CASE_STUDY_STATS,
  PROJECTS,
  getProjectBySlug,
} from '@/features/projects/projects.constants'
import { GLYPHS } from '@/lib/glyphs'
import { ROUTES, projectPath } from '@/lib/routes'
import { techTags } from '@/lib/tech'
import { Button, Container, PageHeader, Reveal, TagList, TextLink } from '@app/ui'

const MediaFrame = ({ ratio, caption }: { ratio: string; caption?: string }) => (
  <figure className="m-0">
    <div className="border-border bg-card overflow-hidden rounded-xl border">
      <div className={`flex ${ratio} text-faint items-center justify-center`}>
        <SheepMark aria-hidden className="text-primary/40 size-10" />
      </div>
    </div>
    {caption && (
      <figcaption className="text-faint mt-3 text-center font-mono text-xs">{caption}</figcaption>
    )}
  </figure>
)

export const ProjectPage = () => {
  const { t } = useTranslation(['projects', 'common'])
  const { slug } = useParams()
  const project = slug ? getProjectBySlug(slug) : undefined

  if (!project) {
    return (
      <Container width="article" className="py-32 text-center">
        <p className="text-faint font-mono text-sm">{t('projects.empty')}</p>
        <TextLink asChild className="mt-6">
          <Link to={ROUTES.PROJECTS}>{t('caseStudy.allProjects')}</Link>
        </TextLink>
      </Container>
    )
  }

  const base = `projects.items.${project.key}`
  const currentIndex = PROJECTS.findIndex((p) => p.slug === project.slug)
  // Modulo garantuje opseg, ali noUncheckedIndexedAccess to ne može da dokaže.
  // Fallback je sam projekat — jedini slučaj u kome bi pao je lista od jednog elementa.
  const next = PROJECTS[(currentIndex + 1) % PROJECTS.length] ?? project

  return (
    <Container as="article" width="article" className="pt-20 pb-24">
      <PageHeader
        title={t(`${base}.title`)}
        backLink={
          <TextLink asChild className="border-b-0">
            <Link to={ROUTES.PROJECTS}>← {t('caseStudy.allProjects')}</Link>
          </TextLink>
        }
        className="mb-4"
      />
      {/* Stack je ranije stajao i ovde, kao `next.js / typescript / postgresql`. Izašao je
          kad su tagovi dobili logotipe: isti spisak dvaput jedan ispod drugog. */}
      <div className="text-faint mb-4 flex flex-wrap items-center gap-3 font-mono text-[13px]">
        <span className="text-primary">{t(`${base}.cat`)}</span>
        <span>·</span>
        <span>{project.year}</span>
      </div>
      <TagList
        tags={techTags(project.tech)}
        variant="logo"
        size="bare"
        font="sans"
        className="mb-11"
      />

      <div className="border-border bg-card mb-14 rounded-xl border p-7 sm:px-8">
        <div className="text-faint mb-4 font-mono text-[11.5px] tracking-[0.1em] uppercase">
          {t('caseStudy.highlightsLabel')}
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {CASE_STUDY_HIGHLIGHTS.map((key) => (
            <div key={key} className="text-foreground flex gap-2.5 text-[15.5px] leading-snug">
              <span aria-hidden className="text-primary font-bold">
                {GLYPHS.CHECK}
              </span>
              <span>{t(key)}</span>
            </div>
          ))}
        </div>
      </div>

      <Reveal className="mb-14">
        <MediaFrame ratio="aspect-[16/9]" caption={t('caseStudy.heroCaption')} />
      </Reveal>

      {CASE_STUDY_SECTIONS.slice(0, 2).map((section) => (
        <Reveal as="section" key={section.id} className="mx-auto mb-14 max-w-[720px]">
          <h2 className="font-heading text-foreground mb-4 text-[30px] font-bold tracking-tight">
            {t(section.titleKey)}
          </h2>
          {section.bodyKeys.map((key) => (
            <p
              key={key}
              className="text-muted-foreground mb-3.5 text-[17px] leading-relaxed text-pretty"
            >
              {t(key)}
            </p>
          ))}
        </Reveal>
      ))}

      <div className="mb-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <MediaFrame ratio="aspect-[4/3]" />
        <MediaFrame ratio="aspect-[4/3]" />
      </div>
      <p className="text-faint mb-14 text-center font-mono text-xs">{t('caseStudy.gridCaption')}</p>

      <div className="bg-inverse relative mb-14 overflow-hidden rounded-xl p-11">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage: 'radial-gradient(var(--inverse-border) 1.2px, transparent 1.2px)',
            backgroundSize: '22px 22px',
          }}
        />
        <div className="relative grid grid-cols-1 gap-8 text-center sm:grid-cols-3">
          {CASE_STUDY_STATS.map((stat) => (
            <div key={stat.id}>
              <div className="font-heading text-inverse-primary text-[44px] font-bold">
                {t(stat.valueKey)}
              </div>
              <div className="text-inverse-muted mt-1 font-mono text-xs">{t(stat.labelKey)}</div>
            </div>
          ))}
        </div>
      </div>

      <Reveal as="section" className="mx-auto mb-16 max-w-[720px]">
        <h2 className="font-heading text-foreground mb-4 text-[30px] font-bold tracking-tight">
          {t(CASE_STUDY_SECTIONS[2].titleKey)}
        </h2>
        {CASE_STUDY_SECTIONS[2].bodyKeys.map((key) => (
          <p key={key} className="text-muted-foreground text-[17px] leading-relaxed text-pretty">
            {t(key)}
          </p>
        ))}
      </Reveal>

      <div className="mx-auto mb-16 flex max-w-[720px] flex-wrap items-center gap-3.5">
        <Button asChild variant="outline" shape="pill" size="sm">
          <a href="#top">{t('caseStudy.github')} ↗</a>
        </Button>
        <Button asChild shape="pill" size="sm">
          <a href="#top">{t('caseStudy.liveDemo')} ↗</a>
        </Button>
        <span className="text-faint font-mono text-xs">{t('caseStudy.demoNote')}</span>
      </div>

      <div className="border-border flex items-center justify-between gap-4 border-t pt-8">
        <span className="text-faint font-mono text-xs">{t('caseStudy.nextUp')}</span>
        <Link
          to={projectPath(next.slug)}
          className="font-heading text-foreground hover:text-primary text-[22px] font-semibold tracking-tight transition-colors"
        >
          {t(`projects.items.${next.key}.title`)} →
        </Link>
      </div>
    </Container>
  )
}
