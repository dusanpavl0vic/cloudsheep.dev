import { useTranslations } from 'next-intl'

import Icon from '@/components/foundations/Icon'
import Logo from '@/components/foundations/Logo'
import Section from '@/components/sections/Section'
import SectionHeader from '@/components/sections/SectionHeader'
import { BRAND } from '@/constants/brand'
import { EFFECT_ATTRS } from '@/constants/effects'
import { contactHref, HOME_SECTIONS } from '@/constants/routes'

import { FAQ_ITEMS, TYPING_DOTS } from './Faq.constants'
import {
  Answer,
  AnswerText,
  Ask,
  Asked,
  Aside,
  Chat,
  ChatHead,
  ChatName,
  ChatStatus,
  ChatTld,
  ChatWho,
  Dot,
  Item,
  Items,
  Layout,
  Number,
  Question,
  Reply,
  Summary,
  Toggle,
  Typing,
} from './Faq.styles'

const reveal = { [EFFECT_ATTRS.reveal]: '' }

/** „Pitano ranije, odgovoreno ovde." — chat kartica sa CTA i pitanja u nativnom `<details>`. */
const Faq = () => {
  const t = useTranslations('home.faq')

  return (
    <Section id={HOME_SECTIONS.FAQ} labelledBy="faq-title">
      <Layout>
        <Aside>
          <SectionHeader eyebrow={t('eyebrow')} title={t('title')} muted={t('muted')} titleId="faq-title" />
          <Chat {...reveal}>
            <ChatHead>
              <Logo markOnly size={34} />
              <ChatWho>
                <ChatName>
                  {BRAND.wordmark}
                  <ChatTld>{BRAND.tld}</ChatTld>
                </ChatName>
                <ChatStatus>{t('chat.reply')}</ChatStatus>
              </ChatWho>
            </ChatHead>
            <Asked>{t('chat.q')}</Asked>
            <Reply>
              <Logo markOnly size={28} />
              <Answer>{t('chat.a')}</Answer>
            </Reply>
            <Typing aria-hidden="true">
              {TYPING_DOTS.map((index) => (
                <Dot key={index} $index={index} />
              ))}
            </Typing>
            <Ask href={contactHref()}>
              <span>
                <strong>{t('chat.still')}</strong> {t('chat.ask')}
              </span>
              <Icon name="arrowRight" size={18} />
            </Ask>
          </Chat>
        </Aside>
        <Items>
          {FAQ_ITEMS.map((key, index) => (
            <Item key={key} open={index === 0} {...reveal}>
              <Summary>
                <Number aria-hidden="true">{String(index + 1).padStart(2, '0')}</Number>
                <Question>{t(`items.${key}.q`)}</Question>
                <Toggle aria-hidden="true">
                  <Icon name="plus" size={18} />
                </Toggle>
              </Summary>
              <AnswerText>{t(`items.${key}.a`)}</AnswerText>
            </Item>
          ))}
        </Items>
      </Layout>
    </Section>
  )
}

export default Faq
