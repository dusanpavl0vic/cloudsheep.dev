import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { AMBIENT_GLOW } from '@/lib/ambient'
import { BRAND, GLYPHS } from '@/lib/glyphs'
import { ROUTES } from '@/lib/routes'
import { Button, cn, dottedSurfaceVariants } from '@app/ui'

import { NotFoundCards } from '../NotFoundCards'
import {
  notFoundCtaVariants,
  notFoundDotsVariants,
  notFoundGlowVariants,
  notFoundTerminalVariants,
  notFoundTitleVariants,
  notFoundVariants,
} from './NotFoundHero.variants'

/**
 * 404 kao hero, a ne kao ekran greške.
 *
 * Tekst ostaje u `common` namespace-u iako je ovo feature: ista komponenta se renderuje i kao
 * `errorElement` rute projekta, a feature namespace koji ne stigne da se učita dao bi sirove
 * ključeve na strani čiji je jedini posao da te pošalje dalje.
 *
 * Bez animacije i bez opisnog pasusa, oba namerno: gigant `404`, terminal red iznad njega i
 * dva izlaza ispod su sve što strana treba da kaže.
 */
export const NotFoundHero = () => {
  const { t } = useTranslation('common')

  return (
    <section className={notFoundVariants()}>
      <span aria-hidden className={cn(dottedSurfaceVariants(), notFoundDotsVariants())} />
      <span
        aria-hidden
        className={notFoundGlowVariants()}
        style={{ backgroundImage: AMBIENT_GLOW }}
      />

      <NotFoundCards />

      <p className={notFoundTerminalVariants()}>
        <span className="text-primary">{GLYPHS.PROMPT}</span>
        <span>{BRAND.NOT_FOUND_COMMAND}</span>
        <span aria-hidden className="text-faint">
          →
        </span>
        <span className="text-destructive">{t('notFound.terminal')}</span>
        <span aria-hidden className="caret" />
      </p>

      <h1 className={notFoundTitleVariants()}>404</h1>

      <div className={notFoundCtaVariants()}>
        <Button asChild size="lg">
          <Link to={ROUTES.HOME}>← {t('notFound.home')}</Link>
        </Button>
        <Button asChild variant="outline" size="lg">
          <Link to={ROUTES.PROJECTS}>{t('notFound.work')}</Link>
        </Button>
      </div>
    </section>
  )
}
