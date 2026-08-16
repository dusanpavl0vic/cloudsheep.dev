import { useTranslation } from 'react-i18next'

import { ContactForm } from '@/features/contact/components/ContactForm'
import { CONTACT_EMAIL } from '@/lib/navigation'
import { Container, PageHeader, Reveal } from '@app/ui'

/** Naslov kontakt podatka — <dt> u definicionoj listi, ne <Label>: nema kontrolu na koju bi se vezao. */
const contactTermClass = 'mb-1.5 block font-mono text-xs tracking-wide text-faint uppercase'

const socialPillClass =
  'rounded-full border border-border-strong px-4 py-1.5 text-[13.5px] font-semibold text-muted-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background'

export const ContactPage = () => {
  const { t } = useTranslation(['contact', 'common'])

  return (
    <Container
      width="content"
      className="grid grid-cols-1 items-start gap-16 pt-20 pb-24 lg:grid-cols-[1fr_1.1fr]"
    >
      <Reveal direction="left">
        <PageHeader
          eyebrow={t('contact.eyebrow')}
          title={t('contact.pageTitle')}
          subtitle={t('contact.pageLead')}
          className="mb-9"
        />

        <dl className="flex flex-col gap-5">
          <div>
            <dt className={contactTermClass}>{t('contact.emailLabel')}</dt>
            <dd>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="border-primary text-foreground hover:text-primary w-fit border-b-2 pb-0.5 font-mono text-[16px] transition-colors"
              >
                {CONTACT_EMAIL}
              </a>
            </dd>
          </div>
          <div>
            <dt className={contactTermClass}>{t('contact.baseLabel')}</dt>
            <dd className="text-muted-foreground text-[15.5px]">{t('contact.baseValue')}</dd>
          </div>
          <div>
            <dt className={contactTermClass}>{t('contact.elsewhereLabel')}</dt>
            <dd className="flex gap-3">
              <a
                href="https://github.com/cloudsheep"
                target="_blank"
                rel="noopener noreferrer"
                className={socialPillClass}
              >
                {t('footer.github')}
              </a>
              <a
                href="https://linkedin.com/in/cloudsheep"
                target="_blank"
                rel="noopener noreferrer"
                className={socialPillClass}
              >
                {t('footer.linkedin')}
              </a>
            </dd>
          </div>
        </dl>
      </Reveal>

      <Reveal direction="right">
        <ContactForm />
      </Reveal>
    </Container>
  )
}
