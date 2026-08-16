import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { SpiralMark } from '@/components/Logo'
import { CONTACT_EMAIL, SECTION_IDS } from '@/lib/navigation'
import { ROUTES } from '@/lib/routes'
import { Button, Container } from '@app/ui'

import {
  contactBannerVariants,
  contactEmailVariants,
  contactMarkVariants,
  contactTitleVariants,
} from './ContactSection.variants'

export const ContactSection = () => {
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
          <SpiralMark aria-hidden className={contactMarkVariants()} />
          <h2 className={contactTitleVariants()}>
            {t('contact.titleTop')}
            <br />
            {t('contact.titleBottom')}
          </h2>
          <a href={`mailto:${CONTACT_EMAIL}`} className={contactEmailVariants()}>
            {CONTACT_EMAIL}
          </a>
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
