import { useTranslation } from 'react-i18next'

import { Eyebrow } from '@/components/Eyebrow'
import { LogoMark } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { CONTACT_EMAIL, SECTION_IDS } from '@/constants/navigation'

import {
  heroScrollVariants,
  heroTerminalCaretVariants,
  heroTerminalVariants,
  heroTextVariants,
  heroTitleVariants,
  heroVariants,
  heroWatermarkVariants,
} from './HeroSection.variants'

export const HeroSection = () => {
  const { t } = useTranslation()

  return (
    <section id={SECTION_IDS.TOP} className={heroVariants()}>
      <LogoMark className={heroWatermarkVariants()} />

      <Container className="relative flex flex-col gap-6">
        <Eyebrow>{t('hero.eyebrow')}</Eyebrow>

        <h1 className={heroTitleVariants()}>{t('common.appNameLower')}</h1>

        <p className={heroTerminalVariants()}>
          <span className="text-accent">$</span>
          <span>{t('hero.command')}</span>
          <span aria-hidden>→</span>
          <span>{t('hero.commandResult')}</span>
          <span aria-hidden className={heroTerminalCaretVariants()} />
        </p>

        <p className={heroTextVariants()}>{t('hero.description')}</p>

        <div className="flex flex-wrap items-center gap-4 pt-2">
          <Button asChild size="lg" variant="accent">
            <a href={`mailto:${CONTACT_EMAIL}`}>{t('hero.primaryCta')}</a>
          </Button>
          <Button asChild size="lg" variant="outline">
            <a href={`#${SECTION_IDS.WORK}`}>{t('hero.secondaryCta')}</a>
          </Button>
        </div>

        <span className={heroScrollVariants()}>{t('hero.scroll')}</span>
      </Container>
    </section>
  )
}
