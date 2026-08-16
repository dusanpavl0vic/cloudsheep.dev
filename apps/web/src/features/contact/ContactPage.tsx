import { useTranslation } from 'react-i18next'

import { CONTACT_EMAIL } from '@/constants/navigation'
import { Container, Eyebrow, Label, Reveal } from '@app/ui'

import { ContactForm } from './components/ContactForm'

const socialPillClass =
  'rounded-full border border-border-strong px-4 py-1.5 text-[13.5px] font-semibold text-muted-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background'

export const ContactPage = () => {
  const { t } = useTranslation()

  return (
    <Container width="content" className="grid grid-cols-1 items-start gap-16 py-22 lg:grid-cols-[1fr_1.1fr]">
      <Reveal direction="left">
        <Eyebrow>{t('contact.eyebrow')}</Eyebrow>
        <h1 className="mt-3.5 mb-5 font-heading text-[clamp(2.6rem,5.5vw,4.2rem)] leading-none font-bold tracking-[-0.04em] text-foreground text-balance">
          {t('contact.pageTitle')}
        </h1>
        <p className="mb-9 max-w-[440px] text-[17px] leading-relaxed text-muted-foreground text-pretty">
          {t('contact.pageLead')}
        </p>

        <div className="flex flex-col gap-5">
          <div>
            <Label className="mb-1.5 block">{t('contact.emailLabel')}</Label>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="w-fit border-b-2 border-primary pb-0.5 font-mono text-[16px] text-foreground transition-colors hover:text-primary"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <div>
            <Label className="mb-1.5 block">{t('contact.baseLabel')}</Label>
            <span className="text-[15.5px] text-muted-foreground">{t('contact.baseValue')}</span>
          </div>
          <div>
            <Label className="mb-1.5 block">{t('contact.elsewhereLabel')}</Label>
            <div className="flex gap-3">
              <a
                href="https://github.com/cloudsheep"
                target="_blank"
                rel="noreferrer"
                className={socialPillClass}
              >
                {t('footer.github')}
              </a>
              <a
                href="https://linkedin.com/in/cloudsheep"
                target="_blank"
                rel="noreferrer"
                className={socialPillClass}
              >
                {t('footer.linkedin')}
              </a>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal direction="right">
        <ContactForm />
      </Reveal>
    </Container>
  )
}
