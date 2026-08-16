import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { GLYPHS } from '@/lib/glyphs'
import { SECTION_IDS } from '@/lib/navigation'
import { ROUTES } from '@/lib/routes'
import { Badge, Container, ProgressRing, Reveal, TextLink } from '@app/ui'

import {
  gaugeLabelVariants,
  insightBlueCardVariants,
  insightGridVariants,
  insightHeadingVariants,
  insightPanelVariants,
  insightTextVariants,
} from './InsightSection.variants'

/** Popunjenost prstena se izvodi iz iste vrednosti — nema drugog izvora istine. */
const UPTIME_PERCENT = 99.95

/**
 * Prsten prikazuje opseg 99–100%, ne 0–100%.
 *
 * Na punoj skali 99.95% daje procep od 0.21px — prsten izgleda pun i ne saopštava
 * ništa. Na opsegu 99–100 ista vrednost popunjava 95% luka, pa se razlika vidi.
 */
const UPTIME_DOMAIN = [99, 100] as const

export const InsightSection = () => {
  const { t } = useTranslation(['landing', 'common'])

  return (
    <Reveal as="section" className="pt-8">
      <Container>
        <div className={insightGridVariants()}>
          <Link to={ROUTES.CONTACT} className={insightBlueCardVariants()}>
            <span
              aria-hidden
              className="flex size-10 items-center justify-center rounded-full border border-primary-foreground/40 bg-primary-foreground/15 text-[15px]"
            >
              {GLYPHS.SPARKLE}
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
                  {GLYPHS.BLOCKS}
                </span>
                {t('insight.badge')}
              </Badge>
              <h2 className={insightHeadingVariants()}>{t('insight.title')}</h2>
              <TextLink asChild className="mt-4">
                <Link to={`${ROUTES.HOME}#${SECTION_IDS.WORK}`}>{t('insight.seeWork')} →</Link>
              </TextLink>
            </div>

            <div className="flex flex-col items-center gap-2">
              <ProgressRing
                value={UPTIME_PERCENT}
                domain={UPTIME_DOMAIN}
                decimals={2}
                size="lg"
                tone="inverse"
                ariaLabel={`${String(UPTIME_PERCENT)}% ${t('insight.uptime')}`}
              />
              <span className={gaugeLabelVariants()}>{t('insight.uptime')}</span>
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
