import { useTranslations } from 'next-intl'

import GlassCard from '@/components/cards/GlassCard'
import Tag from '@/components/data-display/Tag'
import Section from '@/components/sections/Section'
import SectionHeader from '@/components/sections/SectionHeader'
import { HOME_SECTIONS } from '@/constants/routes'

import { SERVICES } from './Services.constants'
import { Description, Grid, Head, IconTile, Slug, Tags, Title } from './Services.styles'

/** „Četiri discipline, jedan sto." — staklene kartice sa brojem, ikonicom i oznakama. */
const Services = () => {
  const t = useTranslations('home.services')

  return (
    <Section id={HOME_SECTIONS.SERVICES} labelledBy="services-title">
      <SectionHeader eyebrow={t('eyebrow')} title={t('title')} muted={t('muted')} titleId="services-title" />
      <Grid>
        {SERVICES.map((service) => (
          <GlassCard key={service.key} number={service.number} decorated>
            <Head>
              <IconTile>
                <img src={service.icon} alt="" width={24} height={24} loading="lazy" />
              </IconTile>
              <Slug aria-hidden="true">{service.slug}</Slug>
            </Head>
            <Title>{t(`items.${service.key}.title`)}</Title>
            <Description>{t(`items.${service.key}.desc`)}</Description>
            <Tags>
              {service.tags.map((tag) => (
                <li key={tag}>
                  <Tag>{tag}</Tag>
                </li>
              ))}
            </Tags>
          </GlassCard>
        ))}
      </Grid>
    </Section>
  )
}

export default Services
