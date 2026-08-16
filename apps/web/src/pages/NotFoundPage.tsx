import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { SpiralMark } from '@/components/Logo'
import { BRAND } from '@/lib/glyphs'
import { ROUTES } from '@/lib/routes'
import { Button } from '@app/ui'

const GRID_MASK = 'radial-gradient(ellipse 65% 75% at 50% 45%, #000 25%, transparent 72%)'

export const NotFoundPage = () => {
  const { t } = useTranslation('common')

  return (
    <section className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          WebkitMaskImage: GRID_MASK,
          maskImage: GRID_MASK,
        }}
      />
      <SpiralMark
        aria-hidden
        className="pointer-events-none absolute -right-16 -bottom-24 size-[420px] text-primary/[0.07]"
      />

      <div className="relative max-w-[640px] text-center">
        <div className="mb-7 inline-flex flex-wrap items-center justify-center gap-2 font-mono text-[13px] text-foreground">
          <span className="text-primary">$</span>
          <span>{BRAND.NOT_FOUND_COMMAND}</span>
          <span className="text-faint">→</span>
          <span className="text-destructive">{t('notFound.terminal')}</span>
          <span aria-hidden className="caret" />
        </div>
        <h1 className="m-0 mb-4 font-heading text-[clamp(6rem,18vw,12rem)] leading-[0.9] font-bold tracking-[-0.055em] text-foreground">
          404
        </h1>
        <p className="mb-8 text-[18px] leading-relaxed text-muted-foreground text-pretty">
          {t('notFound.body')}
        </p>
        <div className="flex flex-wrap justify-center gap-3.5">
          <Button asChild shape="pill">
            <Link to={ROUTES.HOME}>← {t('notFound.home')}</Link>
          </Button>
          <Button asChild variant="outline" shape="pill">
            <Link to={ROUTES.PROJECTS}>{t('notFound.work')}</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
