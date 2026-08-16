import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { SpiralMark } from '@/components/Logo'
import { SECTION_IDS } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'
import { HERO_TERMINAL_KEYS } from '@/features/landing/landing.constants'
import { useTypewriter } from '@/hooks/useTypewriter'
import { Button } from '@app/ui'

import { CLOUD_DIM, CLOUD_LIT, CLOUD_SIZE, SPOTLIGHT_MASK } from './HeroSection.constants'
import {
  heroCloudsVariants,
  heroCtaVariants,
  heroMonoVariants,
  heroScrollVariants,
  heroSpiralVariants,
  heroTerminalVariants,
  heroTextVariants,
  heroTitleVariants,
  heroVariants,
} from './HeroSection.variants'

export const HeroSection = () => {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const litRef = useRef<HTMLDivElement>(null)

  const phrases = useMemo(() => HERO_TERMINAL_KEYS.map((key) => t(key)), [t])
  const typed = useTypewriter(phrases)

  // Svetlo koje prati kursor — subscribe na mousemove (opravdan useEffect, PROJECT_GUIDE 2.1)
  useEffect(() => {
    const section = sectionRef.current
    const lit = litRef.current
    if (!section || !lit) return

    const onMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      lit.style.setProperty('--mx', `${event.clientX - rect.left}px`)
      lit.style.setProperty('--my', `${event.clientY - rect.top}px`)
    }
    const onLeave = () => {
      lit.style.setProperty('--mx', '-600px')
      lit.style.setProperty('--my', '-600px')
    }

    section.addEventListener('mousemove', onMove)
    section.addEventListener('mouseleave', onLeave)
    return () => {
      section.removeEventListener('mousemove', onMove)
      section.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return (
    <section ref={sectionRef} id={SECTION_IDS.TOP} className={heroVariants()}>
      <div
        aria-hidden
        className={heroCloudsVariants()}
        style={{ backgroundImage: CLOUD_DIM, backgroundSize: CLOUD_SIZE }}
      />
      <div
        ref={litRef}
        aria-hidden
        className={heroCloudsVariants()}
        style={{
          backgroundImage: CLOUD_LIT,
          backgroundSize: CLOUD_SIZE,
          WebkitMaskImage: SPOTLIGHT_MASK,
          maskImage: SPOTLIGHT_MASK,
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_58%_52%_at_50%_46%,var(--background)_26%,transparent_100%)]"
      />

      <SpiralMark aria-hidden animated className={heroSpiralVariants()} />

      <p className={heroMonoVariants()}>cloudsheep.dev</p>

      <h1 className={heroTitleVariants()}>
        {t('hero.titleTop')}
        <br />
        {t('hero.titleBottom')} <span className="text-primary">{t('hero.titleHighlight')}</span>.
      </h1>

      <p className={heroTextVariants()}>{t('hero.description')}</p>

      <p className={heroTerminalVariants()}>
        <span className="text-primary">$</span>
        <span>{typed}</span>
        <span aria-hidden className="caret" />
      </p>

      <div className={heroCtaVariants()}>
        <Button asChild size="lg">
          <Link to={ROUTES.CONTACT}>{t('hero.primaryCta')} →</Link>
        </Button>
        <Button asChild size="lg" variant="outline">
          <Link to={`${ROUTES.HOME}#${SECTION_IDS.WORK}`}>{t('hero.secondaryCta')}</Link>
        </Button>
      </div>

      <span className={heroScrollVariants()}>
        {t('hero.scroll')}
        <span aria-hidden className="text-sm">
          ↓
        </span>
      </span>
    </section>
  )
}
