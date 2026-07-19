import { useTranslation } from 'react-i18next'

import { Logo } from '@/components/Logo'
import { Container } from '@/components/ui/Container'
import { FOOTER_NAV, SOCIAL_LINKS } from '@/constants/navigation'

import {
  footerBottomTextVariants,
  footerBottomVariants,
  footerGridVariants,
  footerGroupTitleVariants,
  footerLinkVariants,
  footerTextVariants,
  siteFooterVariants,
} from './SiteFooter.variants'

export const SiteFooter = () => {
  const { t } = useTranslation()

  return (
    <footer className={siteFooterVariants()}>
      <Container>
        <div className={footerGridVariants()}>
          <div className="flex flex-col gap-4">
            <Logo tone="inverse" size="sm" label={t('common.appNameLower')} />
            <p className={footerTextVariants()}>{t('footer.tagline')}</p>
          </div>

          {FOOTER_NAV.map((group) => (
            <nav key={group.titleKey} className="flex flex-col gap-4">
              <h3 className={footerGroupTitleVariants()}>{t(group.titleKey)}</h3>
              <ul className="flex flex-col gap-2">
                {group.links.map((link) => (
                  <li key={link.labelKey}>
                    <a href={`#${link.id}`} className={footerLinkVariants()}>
                      {t(link.labelKey)}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <nav className="flex flex-col gap-4">
            <h3 className={footerGroupTitleVariants()}>{t('footer.groupElsewhere')}</h3>
            <ul className="flex flex-col gap-2">
              {SOCIAL_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={footerLinkVariants()}
                  >
                    {t(link.labelKey)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className={footerBottomVariants()}>
          <span className={footerBottomTextVariants()}>{t('footer.copyright')}</span>
          <span className={footerBottomTextVariants()}>{t('footer.builtIn')}</span>
        </div>
      </Container>
    </footer>
  )
}
