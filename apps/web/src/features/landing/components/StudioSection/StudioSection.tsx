import { useTranslation } from 'react-i18next'

import { CredentialSeal } from '@/components/CredentialSeal'
import { SECTION_IDS } from '@/lib/navigation'
import { SectionBlock } from '@app/ui'

import {
  studioBodyVariants,
  studioLeadVariants,
  studioSealVariants,
  studioTextVariants,
} from './StudioSection.variants'

/**
 * Ko drži proizvod.
 *
 * Ranije je sekcija nosila i četiri brojke i četiri reda tagova. Oboje je izašlo: brojke
 * su prešle u traku ispod hero-a, tehnologije u mrežu logotipa. Isti podatak na tri mesta
 * nije naglasak nego šum, a sekcija je zbog njega gubila ono jedino što samo ona ima —
 * rečenicu o tome ko radi posao.
 *
 * Na kraju je stajala i pilula „primam projekte za Q3". Nju je zamenio pečat sa diplomom:
 * kvartal zastari za tri meseca i sajt izgleda napušteno, a zvanje ne zastareva. Isti podatak
 * je ranije stajao i u `studio.lead`, pa je odatle skraćen — pečat ga sada nosi jednom.
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

        <CredentialSeal
          className={studioSealVariants()}
          logo="/edu/elfak.webp"
          degree={t('studio.credential.degree')}
          institution={t('studio.credential.institution')}
        />
      </div>
    </SectionBlock>
  )
}
