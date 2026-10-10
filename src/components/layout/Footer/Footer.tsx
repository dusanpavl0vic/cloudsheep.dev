import { useTranslations } from 'next-intl'

import LocalClock from '@/components/data-display/LocalClock'
import Logo from '@/components/foundations/Logo'
import { BRAND } from '@/constants/brand'
import { EFFECT_ATTRS } from '@/constants/effects'
import { CLIENT_CITIES } from '@/constants/navigation'
import { HOME_SECTIONS, ROUTES, homeSectionHref, projectHref, contactHref } from '@/constants/routes'
import { emailFrom } from '@/helpers/links'
import I18nProvider from '@/providers/I18nProvider'

import { shortFor } from './Footer.constants'
import {
  Bottom,
  BottomGroup,
  Cities,
  Column,
  ColumnLink,
  Columns,
  Glow,
  Heading,
  Inner,
  Mail,
  Root,
  Social,
  Socials,
  Tagline,
  Word,
  WordWrap,
} from './Footer.styles'
import type { FooterProps } from './Footer.types'
import NewsletterForm from './NewsletterForm'

/** Namespace-i koje ostrvo newsletter-a prevodi na klijentu (greške stižu kao ključevi). */
const NEWSLETTER_NAMESPACES = ['newsletter', 'email', 'errors', 'validation', 'contact', 'footer'] as const

/** Podnožje (dizajn): newsletter, marka, kolone linkova, gradovi, lokalno vreme, velika reč. */
const Footer = ({ links, projects, className }: FooterProps) => {
  const t = useTranslations()
  const email = emailFrom(links)

  const studio = [HOME_SECTIONS.STUDIO, HOME_SECTIONS.SERVICES, HOME_SECTIONS.PROCESS, HOME_SECTIONS.PRICING] as const
  const resources = [
    { href: ROUTES.NOTES, label: t('nav.notes') },
    { href: homeSectionHref(HOME_SECTIONS.FAQ), label: t('nav.faq') },
    { href: homeSectionHref(HOME_SECTIONS.STACK), label: t('nav.stack') },
    { href: contactHref(), label: t('common.primaryCta') },
  ]

  return (
    <Root className={className}>
      <Glow aria-hidden="true" />
      <Inner>
        <div {...{ [EFFECT_ATTRS.reveal]: '' }}>
          <I18nProvider namespaces={NEWSLETTER_NAMESPACES}>
            <NewsletterForm />
          </I18nProvider>
        </div>

        <Columns>
          <Column>
            <Logo tone="inverse" />
            <Tagline>{t('footer.tagline')}</Tagline>
            <Socials aria-label={t('footer.socialsLabel')}>
              {links.map((link) => (
                <li key={link.id}>
                  <Social href={link.url} title={link.label} aria-label={link.label} {...(link.url.startsWith('http') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    {shortFor(link.platform)}
                  </Social>
                </li>
              ))}
            </Socials>
          </Column>

          <Column aria-label={t('footer.columns.studio')}>
            <Heading>{t('footer.columns.studio')}</Heading>
            {studio.map((section) => (
              <ColumnLink key={section} href={homeSectionHref(section)}>
                {t(`nav.${section}`)}
              </ColumnLink>
            ))}
          </Column>

          <Column aria-label={t('footer.columns.work')}>
            <Heading>{t('footer.columns.work')}</Heading>
            <ColumnLink href={ROUTES.PROJECTS}>{t('footer.allProjects')}</ColumnLink>
            {projects.map((project) => (
              <ColumnLink key={project.slug} href={projectHref(project.slug)}>
                {project.title}
              </ColumnLink>
            ))}
          </Column>

          <Column aria-label={t('footer.columns.resources')}>
            <Heading>{t('footer.columns.resources')}</Heading>
            {resources.map((item) => (
              <ColumnLink key={item.href} href={item.href}>
                {item.label}
              </ColumnLink>
            ))}
          </Column>
        </Columns>

        <Column>
          <Heading>{t('footer.citiesTitle')}</Heading>
          <Cities>
            {CLIENT_CITIES.map((city) => (
              <li key={city}>{city}</li>
            ))}
          </Cities>
        </Column>

        <Bottom>
          <span>{t('footer.copyright', { year: new Date().getFullYear() })}</span>
          <BottomGroup>
            <span>{t('footer.languages')}</span>
            <LocalClock />
            {email && <Mail href={`mailto:${email}`}>{email}</Mail>}
          </BottomGroup>
        </Bottom>
      </Inner>

      <WordWrap aria-hidden="true">
        <Word {...{ [EFFECT_ATTRS.footword]: '' }}>{BRAND.domain}</Word>
      </WordWrap>
    </Root>
  )
}

export default Footer
