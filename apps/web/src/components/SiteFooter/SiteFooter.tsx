import { Mail } from 'lucide-react'
import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { GithubIcon, LinkedinIcon } from '@/components/BrandIcon'
import { Logo } from '@/components/Logo'
import { CONTACT_EMAIL, FOOTER_NAV, SOCIAL_LINKS } from '@/lib/navigation'
import { ROUTES } from '@/lib/routes'
import { Container } from '@app/ui'

import {
  footerBottomTextVariants,
  footerBottomVariants,
  footerDotGridVariants,
  footerGridVariants,
  footerGroupTitleVariants,
  footerHeadlineVariants,
  footerLinkVariants,
  footerSlimRowVariants,
  footerSocialVariants,
  footerTextVariants,
  footerTopVariants,
  siteFooterVariants,
} from './SiteFooter.variants'

const SOCIAL_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  email: Mail,
}

/** Tačkasta tekstura panela — statična (docs/22 §6). */
const DotGrid = () => <div aria-hidden className={footerDotGridVariants()} />

interface SiteFooterProps {
  variant?: 'full' | 'slim'
}

export const SiteFooter = ({ variant = 'full' }: SiteFooterProps) => {
  const { t } = useTranslation('common')

  if (variant === 'slim') {
    return (
      <footer className={siteFooterVariants()}>
        <Container width="content">
          <div className={footerSlimRowVariants()}>
            <Logo tone="default" label={t('common.appNameLower')} />
            <span className={footerBottomTextVariants()}>{t('footer.copyright')}</span>
            <Link to={ROUTES.HOME} className={footerBottomTextVariants()}>
              ↑ {t('footer.backToTop')}
            </Link>
          </div>
        </Container>
      </footer>
    )
  }

  return (
    <footer className={siteFooterVariants()}>
      <DotGrid />
      <Container className="relative pt-20">
        <div className={footerTopVariants()}>
          <div className="flex flex-col gap-6">
            <Logo tone="default" size="md" label={t('common.appNameLower')} />
            <h2 className={footerHeadlineVariants()}>
              {t('footer.ctaLead')}{' '}
              <span className="text-primary">{t('footer.ctaHighlight')}</span>
            </h2>
          </div>
        </div>

        <div className={footerGridVariants()}>
          <div className="flex flex-col gap-6">
            <p className={footerTextVariants()}>{t('footer.tagline')}</p>
            <ul className="flex gap-2.5">
              {SOCIAL_LINKS.map((link) => {
                const Icon = SOCIAL_ICONS[link.id]
                if (!Icon) return null
                return (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target={link.id === 'email' ? undefined : '_blank'}
                      rel="noreferrer"
                      aria-label={t(link.labelKey)}
                      className={footerSocialVariants()}
                    >
                      <Icon />
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>

          {FOOTER_NAV.map((group) => (
            <nav key={group.titleKey} className="flex flex-col">
              <h3 className={footerGroupTitleVariants()}>{t(group.titleKey)}</h3>
              <ul className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <li key={link.id}>
                    <Link to={link.to} className={footerLinkVariants()}>
                      {t(link.labelKey)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div className="flex flex-col">
            <h3 className={footerGroupTitleVariants()}>{t('footer.groupContact')}</h3>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-mono text-[14.5px] text-primary transition-colors hover:brightness-110"
            >
              {CONTACT_EMAIL}
            </a>
            <p className="mt-3 text-[14px] leading-relaxed text-muted-foreground">
              {t('footer.base')}
              <br />
              {t('footer.reply')}
            </p>
          </div>
        </div>

        <div className={footerBottomVariants()}>
          <span className={footerBottomTextVariants()}>{t('footer.copyrightLong')}</span>
          <Link to={ROUTES.HOME} className={footerBottomTextVariants()}>
            ↑ {t('footer.backToTop')}
          </Link>
        </div>
      </Container>
    </footer>
  )
}
