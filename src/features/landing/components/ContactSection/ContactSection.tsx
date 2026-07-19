import { useTranslation } from 'react-i18next'

import { LogoMark } from '@/components/Logo'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { CONTACT_EMAIL, SECTION_IDS } from '@/constants/navigation'

import {
  contactBannerVariants,
  contactEmailVariants,
  contactTitleVariants,
  contactWatermarkVariants,
} from './ContactSection.variants'

export const ContactSection = () => {
  const { t } = useTranslation()

  return (
    <section id={SECTION_IDS.CONTACT} className="py-16">
      <Container>
        <div className={contactBannerVariants()}>
          <LogoMark className={contactWatermarkVariants()} />
          <h2 className={contactTitleVariants()}>{t('contact.title')}</h2>
          <a href={`mailto:${CONTACT_EMAIL}`} className={contactEmailVariants()}>
            {CONTACT_EMAIL}
          </a>
          <Button asChild size="lg" variant="accent">
            <a href={`mailto:${CONTACT_EMAIL}`}>{t('contact.cta')}</a>
          </Button>
        </div>
      </Container>
    </section>
  )
}
