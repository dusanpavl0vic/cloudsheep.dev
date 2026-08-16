import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { SECTION_IDS } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import { Badge, Container, Reveal, TextLink } from '@app/ui'

import {
  gaugeCoreVariants,
  gaugeLabelVariants,
  gaugeRingVariants,
  gaugeValueVariants,
  insightBlueCardVariants,
  insightGridVariants,
  insightHeadingVariants,
  insightPanelVariants,
  insightTextVariants,
} from './InsightSection.variants'

const UPTIME = '99.95%'

export const InsightSection = () => {
  const { t } = useTranslation()

  return (
    <Reveal as="section" className="pt-8">
      <Container>
        <div className={insightGridVariants()}>
          <Link to={ROUTES.CONTACT} className={insightBlueCardVariants()}>
            <span
              aria-hidden
              className="flex size-10 items-center justify-center rounded-full border border-primary-foreground/40 bg-primary-foreground/15 text-[15px]"
            >
              ✦
            </span>
            <span className="flex flex-col gap-4">
              <span className="font-heading text-[27px] leading-tight font-semibold tracking-tight">
                {t('insight.haveProject')}
              </span>
              <span className="w-fit border-b-2 border-primary-foreground/60 pb-0.5 text-[15px] font-semibold">
                {t('insight.getInTouch')} →
              </span>
            </span>
          </Link>

          <div className={insightPanelVariants()}>
            <div className="min-w-[200px] flex-1">
              <Badge variant="soft" className="mb-4">
                <span aria-hidden className="text-primary">
                  ▚
                </span>
                {t('insight.badge')}
              </Badge>
              <h2 className={insightHeadingVariants()}>{t('insight.title')}</h2>
              <TextLink asChild className="mt-4">
                <Link to={`${ROUTES.HOME}#${SECTION_IDS.WORK}`}>{t('insight.seeWork')} →</Link>
              </TextLink>
            </div>

            <div
              className={gaugeRingVariants()}
              style={{
                background:
                  'conic-gradient(var(--primary) 0 95%, var(--border-strong) 95% 100%)',
              }}
            >
              <div className={gaugeCoreVariants()}>
                <span className={gaugeValueVariants()}>{UPTIME}</span>
                <span className={gaugeLabelVariants()}>{t('insight.uptime')}</span>
              </div>
            </div>

            <div className="min-w-[170px] flex-1">
              <p className={insightTextVariants()}>{t('insight.body')}</p>
              <TextLink asChild className="mt-3.5">
                <Link to={`${ROUTES.HOME}#${SECTION_IDS.PRICING}`}>{t('insight.waysToWork')} →</Link>
              </TextLink>
            </div>
          </div>
        </div>
      </Container>
    </Reveal>
  )
}
