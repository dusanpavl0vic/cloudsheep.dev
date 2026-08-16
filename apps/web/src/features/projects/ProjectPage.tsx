import { useTranslation } from 'react-i18next'
import { Link, useParams } from 'react-router'

import { SpiralMark } from '@/components/Logo'
import { Reveal } from '@/components/Reveal'
import { TagList } from '@/components/TagList'
import { TextLink } from '@/components/TextLink'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { ROUTES, projectPath } from '@/constants/routes'

import {
  CASE_STUDY_HIGHLIGHTS,
  CASE_STUDY_SECTIONS,
  CASE_STUDY_STATS,
  PROJECTS,
  getProjectBySlug,
} from './projects.constants'

const MediaFrame = ({ ratio, caption }: { ratio: string; caption?: string }) => (
  <figure className="m-0">
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className={`flex ${ratio} items-center justify-center text-faint`}>
        <SpiralMark aria-hidden className="size-10 text-primary/40" />
      </div>
    </div>
    {caption && (
      <figcaption className="mt-3 text-center font-mono text-xs text-faint">{caption}</figcaption>
    )}
  </figure>
)

export const ProjectPage = () => {
  const { t } = useTranslation()
  const { slug } = useParams()
  const project = slug ? getProjectBySlug(slug) : undefined

  if (!project) {
    return (
      <Container width="article" className="py-32 text-center">
        <p className="font-mono text-sm text-faint">{t('projects.empty')}</p>
        <TextLink asChild className="mt-6">
          <Link to={ROUTES.PROJECTS}>{t('caseStudy.allProjects')}</Link>
        </TextLink>
      </Container>
    )
  }

  const base = `projects.items.${project.key}`
  const stack = project.tech.join(' / ').toLowerCase()
  const currentIndex = PROJECTS.findIndex((p) => p.slug === project.slug)
  // Modulo garantuje opseg, ali noUncheckedIndexedAccess to ne može da dokaže.
  // Fallback je sam projekat — jedini slučaj u kome bi pao je lista od jednog elementa.
  const next = PROJECTS[(currentIndex + 1) % PROJECTS.length] ?? project

  return (
    <Container as="article" width="article" className="pt-16 pb-24">
      <TextLink asChild className="border-b-0 text-[13px] text-muted-foreground hover:text-foreground">
        <Link to={ROUTES.PROJECTS}>← {t('caseStudy.allProjects')}</Link>
      </TextLink>

      <h1 className="mt-5 mb-4 font-heading text-[clamp(2.6rem,6vw,5rem)] leading-[0.96] font-bold tracking-[-0.045em] text-foreground">
        {t(`${base}.title`)}
      </h1>
      <div className="mb-4 flex flex-wrap items-center gap-3 font-mono text-[13px] text-faint">
        <span className="text-primary">{t(`${base}.cat`)}</span>
        <span>·</span>
        <span>{project.year}</span>
        <span>·</span>
        <span>{stack}</span>
      </div>
      <TagList tags={project.tech} variant="outline" font="sans" className="mb-11" />

      <div className="mb-14 rounded-xl border border-border bg-card p-7 sm:px-8">
        <div className="mb-4 font-mono text-[11.5px] tracking-[0.1em] uppercase text-faint">
          {t('caseStudy.highlightsLabel')}
        </div>
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
          {CASE_STUDY_HIGHLIGHTS.map((key) => (
            <div key={key} className="flex gap-2.5 text-[15.5px] leading-snug text-foreground">
              <span aria-hidden className="font-bold text-primary">
                ✓
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
          <h2 className="mb-4 font-heading text-[30px] font-bold tracking-tight text-foreground">
            {t(section.titleKey)}
          </h2>
          {section.bodyKeys.map((key) => (
            <p key={key} className="mb-3.5 text-[17px] leading-relaxed text-muted-foreground text-pretty">
              {t(key)}
            </p>
          ))}
        </Reveal>
      ))}

      <div className="mb-3 grid grid-cols-1 gap-5 sm:grid-cols-2">
        <MediaFrame ratio="aspect-[4/3]" />
        <MediaFrame ratio="aspect-[4/3]" />
      </div>
      <p className="mb-14 text-center font-mono text-xs text-faint">{t('caseStudy.gridCaption')}</p>

      <div className="relative mb-14 overflow-hidden rounded-xl bg-inverse p-11">
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
              <div className="font-heading text-[44px] font-bold text-inverse-primary">
                {t(stat.valueKey)}
              </div>
              <div className="mt-1 font-mono text-xs text-inverse-muted">{t(stat.labelKey)}</div>
            </div>
          ))}
        </div>
      </div>

      <Reveal as="section" className="mx-auto mb-16 max-w-[720px]">
        <h2 className="mb-4 font-heading text-[30px] font-bold tracking-tight text-foreground">
          {t(CASE_STUDY_SECTIONS[2].titleKey)}
        </h2>
        {CASE_STUDY_SECTIONS[2].bodyKeys.map((key) => (
          <p key={key} className="text-[17px] leading-relaxed text-muted-foreground text-pretty">
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
        <span className="font-mono text-xs text-faint">{t('caseStudy.demoNote')}</span>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border pt-8">
        <span className="font-mono text-xs text-faint">{t('caseStudy.nextUp')}</span>
        <Link
          to={projectPath(next.slug)}
          className="font-heading text-[22px] font-semibold tracking-tight text-foreground transition-colors hover:text-primary"
        >
          {t(`projects.items.${next.key}.title`)} →
        </Link>
      </div>
    </Container>
  )
}
