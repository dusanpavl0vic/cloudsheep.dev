import { useTranslation } from 'react-i18next'

import { Eyebrow } from '@/components/Eyebrow'
import { PricingCard } from '@/components/PricingCard'
import { SectionBlock } from '@/components/SectionBlock'
import { SECTION_IDS } from '@/constants/navigation'
import { PRICING_PLANS } from '@/features/landing/landing.constants'

export const PricingSection = () => {
  const { t } = useTranslation()

  return (
    <SectionBlock
      id={SECTION_IDS.PRICING}
      eyebrow={t('pricing.eyebrow')}
      title={t('pricing.title')}
    >
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PRICING_PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              title={t(plan.titleKey)}
              price={t(plan.priceKey)}
              description={t(plan.descriptionKey)}
              features={plan.featureKeys.map((key) => t(key))}
              {...('badgeKey' in plan ? { badge: t(plan.badgeKey) } : {})}
              featured={'featured' in plan}
            />
          ))}
        </div>
        <Eyebrow>{t('pricing.note')}</Eyebrow>
      </div>
    </SectionBlock>
  )
}
