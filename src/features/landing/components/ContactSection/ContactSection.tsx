import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { SpiralMark } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { CONTACT_EMAIL, SECTION_IDS } from '@/constants/navigation'
import { ROUTES } from '@/constants/routes'

import {
  contactBannerVariants,
  contactEmailVariants,
  contactMarkVariants,
  contactTitleVariants,
} from './ContactSection.variants'

export const ContactSection = () => {
  const { t } = useTranslation()

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
