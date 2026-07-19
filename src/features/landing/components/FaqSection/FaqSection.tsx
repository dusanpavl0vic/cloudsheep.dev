import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { SectionBlock } from '@/components/SectionBlock'
import { Accordion } from '@/components/ui/Accordion'
import { SECTION_IDS } from '@/constants/navigation'
import { FAQ_ITEMS } from '@/features/landing/landing.constants'

export const FaqSection = () => {
  const { t } = useTranslation()

  // Izvedena vrednost — mapiranje ključeva u prevode tokom rendera (PROJECT_GUIDE.md 2.1)
  const items = useMemo(
    () =>
      FAQ_ITEMS.map((item) => ({
        id: item.id,
        question: t(item.questionKey),
        answer: t(item.answerKey),
      })),
    [t],
  )

  return (
    <SectionBlock
      id={SECTION_IDS.FAQ}
      eyebrow={t('faq.eyebrow')}
      title={t('faq.title')}
      width="narrow"
      align="center"
    >
      <Accordion items={items} />
    </SectionBlock>
  )
}
