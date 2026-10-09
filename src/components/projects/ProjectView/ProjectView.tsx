import { useTranslations } from 'next-intl'

import Button from '@/components/buttons/Button'
import Tag from '@/components/data-display/Tag'
import Icon from '@/components/foundations/Icon'
import Cover from '@/components/media/Cover'
import { EFFECT_ATTRS } from '@/constants/effects'
import { projectHref } from '@/constants/routes'
import type { ProjectDetail } from '@/types/project'

import CaseHeader from './CaseHeader'
import GrowthChart from './GrowthChart'
import { Body, Chapter, Fact, Facts, Gallery, Head, Links, Next, NextLabel, NextText, NextTitle, Panel, Stack } from './ProjectView.styles'
import ScreenShowcase from './ScreenShowcase'

const reveal = { [EFFECT_ATTRS.reveal]: '' }
const paragraphs = (text: string) => text.split(/\n{2,}/).filter(Boolean)
const hostOf = (url: string | null, fallback: string) => (url ? url.replace(/^https?:\/\//, '').replace(/\/$/, '') : fallback)

/** `/projects/[slug]` — studija slučaja: vrh, ekrani, činjenice, poglavlja, rast, sledeći projekat. */
const ProjectView = ({ project }: { project: ProjectDetail }) => {
  const t = useTranslations('projects.caseStudy')
  const screenCount = Math.max(project.screens.phone.length, project.screens.browser.length)
  const hasScreens = screenCount > 0

  return (
    <article>
      <Head>
        <CaseHeader project={project} />
      </Head>
      <Body>
        {hasScreens ? (
          <ScreenShowcase
            screens={project.screens}
            host={hostOf(project.liveUrl, project.slug)}
            labels={{
              region: t('screensLabel'),
              device: { phone: t('device.phone'), browser: t('device.browser') },
              screen: Array.from({ length: screenCount }, (_, index) => t('screen', { index: index + 1 })),
            }}
          />
        ) : (
          project.cover && <Cover image={project.cover} fallbackAlt={project.title} ratio="16 / 9" radius={24} eager />
        )}

        <Facts>
          {project.role && (
            <Fact {...reveal}>
              <dt>{t('role')}</dt>
              <dd>{project.role}</dd>
            </Fact>
          )}
          {project.technologies.length > 0 && (
            <Fact {...reveal}>
              <dt>{t('stack')}</dt>
              <dd>
                <Stack>
                  {project.technologies.map((tech) => (
                    <li key={tech.id}>
                      <Tag variant="soft" iconUrl={tech.logoUrl}>
                        {tech.label}
                      </Tag>
                    </li>
                  ))}
                </Stack>
              </dd>
            </Fact>
          )}
          {project.timeline && (
            <Fact {...reveal}>
              <dt>{t('timeline')}</dt>
              <dd>{project.timeline}</dd>
            </Fact>
          )}
        </Facts>

        {project.chapters.map((chapter) => (
          <Chapter key={chapter.title} {...reveal}>
            <h2>{chapter.title}</h2>
            <div>
              {paragraphs(chapter.body).map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>
          </Chapter>
        ))}

        {project.growth.length > 1 && (
          <Panel {...reveal}>
            <h2>{t('growth')}</h2>
            <GrowthChart
              data={project.growth}
              axis={project.growth.map((_, index) => (index === 0 ? t('growthLaunch') : t('growthMonth', { index })))}
              summary={t('growthSummary', {
                first: project.growth[0] ?? 0,
                last: project.growth.at(-1) ?? 0,
                count: project.growth.length - 1,
              })}
            />
          </Panel>
        )}

        {project.galleryLayout !== 'none' && project.gallery.length > 0 && (
          <section aria-label={t('gallery')}>
            <Gallery>
              {project.gallery.map((image) => (
                <li key={image.url} {...reveal}>
                  <Cover image={image} fallbackAlt={project.title} ratio="16 / 10" radius={18} />
                </li>
              ))}
            </Gallery>
          </section>
        )}

        {(project.liveUrl ?? project.repoUrl) && (
          <Links>
            {project.liveUrl && (
              <Button href={project.liveUrl} size="l" iconRight="arrowUpRight">
                {t('live')}
              </Button>
            )}
            {project.repoUrl && (
              <Button href={project.repoUrl} variant="secondary" size="l" iconRight="arrowUpRight">
                {t('repo')}
              </Button>
            )}
          </Links>
        )}

        {project.next && (
          <Next href={projectHref(project.next.slug)}>
            <NextText>
              <NextLabel>{t('next')}</NextLabel>
              <NextTitle>{project.next.title}</NextTitle>
            </NextText>
            <Icon name="arrowRight" size={36} />
          </Next>
        )}
      </Body>
    </article>
  )
}

export default ProjectView
