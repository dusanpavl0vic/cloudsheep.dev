import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { SpiralMark } from '@/components/Logo'
import { HeroCards } from '@/features/landing/components/HeroCards'
import { HERO_TERMINAL_KEYS } from '@/features/landing/landing.constants'
import { useTypewriter } from '@/hooks/useTypewriter'
import { BRAND, GLYPHS } from '@/lib/glyphs'
import { SECTION_IDS } from '@/lib/navigation'
import { ROUTES } from '@/lib/routes'
import { useMediaQuery } from '@app/hooks'
import { Button } from '@app/ui'

import { AMBIENT_GLOW, CURSOR_GLOW } from './HeroSection.constants'
import {
  heroAmbientVariants,
  heroCtaVariants,
  heroDotsVariants,
  heroCursorGlowVariants,
  heroMonoVariants,
  heroScrollArrowVariants,
  heroScrollVariants,
  heroSpiralVariants,
  heroTerminalVariants,
  heroTextVariants,
  heroTitleMutedVariants,
  heroTitleVariants,
  heroVariants,
} from './HeroSection.variants'

export const HeroSection = () => {
  const { t } = useTranslation(['landing', 'common'])
  const sectionRef = useRef<HTMLElement>(null)
  const litRef = useRef<HTMLDivElement>(null)
  const prefersReduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  const phrases = useMemo(() => HERO_TERMINAL_KEYS.map((key) => t(key)), [t])
  const typed = useTypewriter(phrases)

  // effect: mousemove na sekciji — svetlo koje prati kursor.
  // Pozicija ide direktno na stil čvora, bez setState: pomeraj miša ne sme da rerenderuje hero.
  useEffect(() => {
    // Ranije ovo nije poštovalo prefers-reduced-motion jer je JS, pa ga CSS blok nije pokrivao
    if (prefersReduced) return

    const section = sectionRef.current
    const lit = litRef.current
    if (!section || !lit) return

    const onMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      lit.style.setProperty('--mx', `${String(event.clientX - rect.left)}px`)
      lit.style.setProperty('--my', `${String(event.clientY - rect.top)}px`)
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
  }, [prefersReduced])

  const scrollToNext = () => {
    document.getElementById(SECTION_IDS.STUDIO)?.scrollIntoView({
      behavior: prefersReduced ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <section ref={sectionRef} id={SECTION_IDS.TOP} className={heroVariants()}>
      {/* Statična tačkasta tekstura — gasi se ka centru da ne smeta naslovu */}
      <div aria-hidden className={heroDotsVariants()} />

      {/* Statični ambijentalni sjaj — nema šare i ništa se ne pomera samo od sebe */}
      <div aria-hidden className={heroAmbientVariants()} style={{ backgroundImage: AMBIENT_GLOW }} />

      {/* Svetlo oko kursora — jedini pokretan sloj */}
      <div
        ref={litRef}
        aria-hidden
        className={heroCursorGlowVariants()}
        style={{ backgroundImage: CURSOR_GLOW }}
      />

      <HeroCards />

      <SpiralMark aria-hidden animated className={heroSpiralVariants()} />

      <p className={heroMonoVariants()}>{BRAND.DOMAIN}</p>

      {/* Dvotonski naslov: nosivi deo pun, nastavak prigušen (docs/22 §1) */}
      <h1 className={heroTitleVariants()}>
        {t('hero.titleTop')}
        <br />
        <span className={heroTitleMutedVariants()}>
          {t('hero.titleBottom')} {t('hero.titleHighlight')}
        </span>
      </h1>

      <p className={heroTextVariants()}>{t('hero.description')}</p>

      <p className={heroTerminalVariants()}>
        <span aria-hidden className="text-primary">
          {GLYPHS.PROMPT}
        </span>
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

      <button type="button" onClick={scrollToNext} className={heroScrollVariants()}>
        {t('hero.scroll')}
        <span aria-hidden className={heroScrollArrowVariants()}>
          ↓
        </span>
      </button>
    </section>
  )
}
