import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { HeroCards } from '@/features/landing/components/HeroCards'
import { HERO_TERMINAL_KEYS } from '@/features/landing/landing.constants'
import type { Technology } from '@/features/projects'
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
  heroTerminalVariants,
  heroTextVariants,
  heroTitleMutedVariants,
  heroTitleVariants,
  heroVariants,
} from './HeroSection.variants'

interface HeroSectionProps {
  technologies: readonly Technology[]
}

export const HeroSection = ({ technologies }: HeroSectionProps) => {
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

    /**
     * Pravougaonik se čita JEDNOM i pamti.
     *
     * Ranije je `getBoundingClientRect()` stajao unutar `onMove`, dakle izvršavao se pri
     * svakom pomeraju miša — i to odmah posle `setProperty` iz prethodnog događaja. To je
     * layout thrashing: upis poništi stil, sledeće čitanje natera pretraživač da ponovo
     * izračuna raspored pre nego što odgovori. Lighthouse je to izmerio kao 104 ms
     * prisilnog preračunavanja.
     *
     * Sada pomeraj miša ne čita raspored uopšte; vrednost se osvežava samo kad se stvarno
     * promeni — na skrolu i promeni veličine, i to najviše jednom po kadru.
     */
    let rect = section.getBoundingClientRect()
    let queued = false

    const refresh = () => {
      if (queued) return
      queued = true
      requestAnimationFrame(() => {
        rect = section.getBoundingClientRect()
        queued = false
      })
    }

    const onMove = (event: MouseEvent) => {
      lit.style.setProperty('--mx', `${String(event.clientX - rect.left)}px`)
      lit.style.setProperty('--my', `${String(event.clientY - rect.top)}px`)
    }

    const onLeave = () => {
      lit.style.setProperty('--mx', '-600px')
      lit.style.setProperty('--my', '-600px')
    }

    section.addEventListener('mousemove', onMove)
    section.addEventListener('mouseleave', onLeave)
    window.addEventListener('scroll', refresh, { passive: true })
    window.addEventListener('resize', refresh)

    return () => {
      section.removeEventListener('mousemove', onMove)
      section.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('scroll', refresh)
      window.removeEventListener('resize', refresh)
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
      <div
        aria-hidden
        className={heroAmbientVariants()}
        style={{ backgroundImage: AMBIENT_GLOW }}
      />

      {/* Svetlo oko kursora — jedini pokretan sloj */}
      <div
        ref={litRef}
        aria-hidden
        className={heroCursorGlowVariants()}
        style={{ backgroundImage: CURSOR_GLOW }}
      />

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

      {/* Posle poziva na akciju, jer ispod `xl` postaje traka u toku. Lebdeći raspored je
          `absolute` u odnosu na sekciju, pa mu mesto u DOM-u ništa ne menja. */}
      <HeroCards technologies={technologies} />

      <button type="button" onClick={scrollToNext} className={heroScrollVariants()}>
        {t('hero.scroll')}
        <span aria-hidden className={heroScrollArrowVariants()}>
          ↓
        </span>
      </button>
    </section>
  )
}
