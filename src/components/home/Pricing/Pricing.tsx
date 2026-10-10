import { useLocale, useTranslations } from 'next-intl'

import Button from '@/components/buttons/Button'
import Icon from '@/components/foundations/Icon'
import Section from '@/components/sections/Section'
import SectionHeader from '@/components/sections/SectionHeader'
import { EFFECT_ATTRS } from '@/constants/effects'
import { EARLIEST_START_MONTHS } from '@/constants/estimator'
import { contactHref, HOME_SECTIONS } from '@/constants/routes'
import { addMonths, formatDate } from '@/helpers/date'
import I18nProvider from '@/providers/I18nProvider'

import Estimator from './Estimator'
import { PLAN_FEATURES, PLANS } from './Pricing.constants'
import { Badge, Description, Feature, Features, Name, Plan, Plans, Price, Rule } from './Pricing.styles'

/** „Tri načina da uđemo u posao" — paketi i procena. Procena je jedino klijentsko ostrvo. */
const Pricing = () => {
  const t = useTranslations('home.pricing')
  const locale = useLocale()

  return (
    <Section id={HOME_SECTIONS.PRICING} labelledBy="pricing-title">
      <SectionHeader eyebrow={t('eyebrow')} title={t('title')} muted={t('muted')} titleId="pricing-title" align="center" />
      <Plans>
        {PLANS.map(({ key, featured }) => (
          <Plan key={key} $featured={featured} {...{ [EFFECT_ATTRS.reveal]: '' }}>
            {featured && <Badge>{`★ ${t('popular')}`}</Badge>}
            <Name>{t(`plans.${key}.title`)}</Name>
            <Price $featured={featured}>{t(`plans.${key}.price`)}</Price>
            <Description>{t(`plans.${key}.desc`)}</Description>
            <Rule aria-hidden="true" />
            <Features>
              {PLAN_FEATURES.map((feature) => (
                <Feature key={feature}>
                  <Icon name="check" size={16} />
                  {t(`plans.${key}.features.${feature}`)}
                </Feature>
              ))}
            </Features>
            <Button href={contactHref({ plan: key })} variant={featured ? 'accent' : 'secondary'} iconRight="arrowRight" fullWidth>
              {t('cta')}
            </Button>
          </Plan>
        ))}
      </Plans>
      <I18nProvider namespaces={['home.estimator']}>
        <Estimator earliestStart={formatDate(addMonths(EARLIEST_START_MONTHS), locale, { month: 'short', year: 'numeric' })} />
      </I18nProvider>
    </Section>
  )
}

export default Pricing
