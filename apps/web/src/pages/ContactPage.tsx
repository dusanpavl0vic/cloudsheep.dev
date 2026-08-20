import { useTranslation } from 'react-i18next'
import { useRouteLoaderData } from 'react-router'

import { ContactForm } from '@/features/contact/components/ContactForm'
import { emailOf, type SiteProfile } from '@/lib/site'
import { Container, PageHeader, Reveal } from '@app/ui'

/** Naslov kontakt podatka — <dt> u definicionoj listi, ne <Label>: nema kontrolu na koju bi se vezao. */
const contactTermClass = 'mb-1.5 block font-mono text-xs tracking-wide text-faint uppercase'

const socialPillClass =
  'rounded-full border border-border-strong px-4 py-1.5 text-[13.5px] font-semibold text-muted-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background'

export const ContactPage = () => {
  // Ista `site` podatke koristi i podnožje; layout loader ih je već razrešio
  const site = useRouteLoaderData<SiteProfile>('site-slim')
  const email = site ? emailOf(site) : undefined

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
              {email && (
                <a
                  href={email.url}
                  className="border-primary text-foreground hover:text-primary w-fit border-b-2 pb-0.5 font-mono text-[16px] transition-colors"
                >
                  {email.url.replace(/^mailto:/, '')}
                </a>
              )}
            </dd>
          </div>
          <div>
            <dt className={contactTermClass}>{t('contact.baseLabel')}</dt>
            <dd className="text-muted-foreground text-[15.5px]">{t('contact.baseValue')}</dd>
          </div>
          <div>
            <dt className={contactTermClass}>{t('contact.elsewhereLabel')}</dt>
            {/* Ranije su GitHub i LinkedIn URL-ovi bili hardkodovani OVDE, drugi put u
                repou — sada su isti podaci koje čita i podnožje. */}
            <dd className="flex flex-wrap gap-3">
              {(site?.links ?? [])
                .filter((link) => link.platform !== 'email')
                .map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={socialPillClass}
                  >
                    {link.label}
                  </a>
                ))}
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
