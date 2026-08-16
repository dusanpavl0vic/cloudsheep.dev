import { useTranslation } from 'react-i18next'

import { SECTION_IDS } from '@/lib/navigation'
import { SectionBlock } from '@app/ui'

import {
  availabilityDotVariants,
  availabilityVariants,
  studioBodyVariants,
  studioLeadVariants,
  studioTextVariants,
} from './StudioSection.variants'

/**
 * Ko drži proizvod.
 *
 * Ranije je sekcija nosila i četiri brojke i četiri reda tagova. Oboje je izašlo: brojke
 * su prešle u traku ispod hero-a, tehnologije u mrežu logotipa. Isti podatak na tri mesta
 * nije naglasak nego šum, a sekcija je zbog njega gubila ono jedino što samo ona ima —
 * rečenicu o tome ko radi posao.
 */
export const StudioSection = () => {
  const { t } = useTranslation('landing')

  return (
    <SectionBlock
      id={SECTION_IDS.STUDIO}
      eyebrow={t('studio.eyebrow')}
      title={t('studio.titleTop')}
      muted={t('studio.titleMuted')}
      align="center"
    >
      <div className={studioBodyVariants()}>
        <p className={studioLeadVariants()}>{t('studio.lead')}</p>
        <p className={studioTextVariants()}>{t('studio.body')}</p>

        <p className={availabilityVariants()}>
          <span aria-hidden className={availabilityDotVariants()} />
          {t('studio.availability')}
        </p>
      </div>
    </SectionBlock>
  )
}
