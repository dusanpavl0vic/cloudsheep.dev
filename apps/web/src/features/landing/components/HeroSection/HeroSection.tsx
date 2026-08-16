import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { SpiralMark } from '@/components/Logo'
import { HERO_TERMINAL_KEYS } from '@/features/landing/landing.constants'
import { useTypewriter } from '@/hooks/useTypewriter'
import { BRAND, GLYPHS } from '@/lib/glyphs'
import { SECTION_IDS } from '@/lib/navigation'
import { ROUTES } from '@/lib/routes'
import { useMediaQuery } from '@app/hooks'
import { Button } from '@app/ui'

import { GRID_FADE, GRID_LINES, SPOTLIGHT_MASK, TEXT_HALO } from './HeroSection.constants'
import {
  heroCtaVariants,
  heroGridLitVariants,
  heroGridStageVariants,
  heroGridVariants,
  heroHorizonVariants,
  heroMonoVariants,
  heroScrollArrowVariants,
  heroScrollVariants,
  heroSpiralVariants,
  heroTerminalVariants,
  heroTextVariants,
  heroTitleVariants,
  heroVariants,
} from './HeroSection.variants'

/** Zajednički stil oba sloja mreže — razlikuju se samo po boji i maski. */
const gridLayerStyle = {
  backgroundImage: GRID_LINES,
  WebkitMaskImage: GRID_FADE,
  maskImage: GRID_FADE,
} as const

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
      <div aria-hidden className={heroGridStageVariants()}>
        {/* Ugašeni sloj — nosi celu mrežu */}
        <div className={heroGridVariants()} style={gridLayerStyle} />

        {/* Upaljeni sloj — ista mreža u boji akcenta, vidi se samo kroz masku oko kursora */}
        <div
          ref={litRef}
          className={heroGridLitVariants()}
          style={{
            ...gridLayerStyle,
            WebkitMaskImage: `${GRID_FADE}, ${SPOTLIGHT_MASK}`,
            maskImage: `${GRID_FADE}, ${SPOTLIGHT_MASK}`,
            WebkitMaskComposite: 'source-in',
            maskComposite: 'intersect',
          }}
        />
      </div>

      <div aria-hidden className={heroHorizonVariants()} />

      {/* Izmaglica iza teksta — odvaja naslov od mreže bez pune podloge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: TEXT_HALO }}
      />

      <SpiralMark aria-hidden animated className={heroSpiralVariants()} />

      <p className={heroMonoVariants()}>{BRAND.DOMAIN}</p>

      <h1 className={heroTitleVariants()}>
        {t('hero.titleTop')}
        <br />
        {t('hero.titleBottom')} <span className="text-primary">{t('hero.titleHighlight')}</span>.
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
