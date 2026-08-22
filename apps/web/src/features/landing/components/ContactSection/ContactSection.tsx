import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { SECTION_IDS } from '@/lib/navigation'
import { ROUTES } from '@/lib/routes'
import type { SiteLink } from '@/lib/site'
import { Button, Container, SheepMark } from '@app/ui'

import {
  contactBannerVariants,
  contactEmailVariants,
  contactMarkVariants,
  contactTitleVariants,
} from './ContactSection.variants'

interface ContactSectionProps {
  /** Mejl link iz baze; `undefined` kad nije unet. */
  email: SiteLink | undefined
}

export const ContactSection = ({ email }: ContactSectionProps) => {
  const { t } = useTranslation(['landing', 'common'])

  return (
    <section id={SECTION_IDS.CONTACT} className="py-14">
      <Container>
        <div className={contactBannerVariants()}>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(var(--inverse-border) 1.2px, transparent 1.2px)',
              backgroundSize: '22px 22px',
            }}
          />
          <SheepMark aria-hidden className={contactMarkVariants()} />
          <h2 className={contactTitleVariants()}>
            {t('contact.titleTop')}
            <br />
            {t('contact.titleBottom')}
          </h2>
          {email && (
            <a href={email.url} className={contactEmailVariants()}>
              {email.url.replace(/^mailto:/, '')}
            </a>
          )}
          <div className="relative mt-6">
            <Button asChild size="lg">
              <Link to={ROUTES.CONTACT}>{t('contact.cta')} →</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
