import { useTranslation } from 'react-i18next'

import { SectionBlock } from '@/components/SectionBlock'
import { WorkItem } from '@/components/WorkItem'
import { Button } from '@/components/ui/Button'
import { CONTACT_EMAIL, SECTION_IDS } from '@/constants/navigation'
import { WORK_ITEMS } from '@/features/landing/landing.constants'

export const WorkSection = () => {
  const { t } = useTranslation()

  return (
    <SectionBlock
      id={SECTION_IDS.WORK}
      eyebrow={t('work.eyebrow')}
      title={t('work.title')}
      action={
        <Button asChild variant="link" size="sm">
          <a href={`mailto:${CONTACT_EMAIL}`}>{t('work.allCases')}</a>
        </Button>
      }
    >
      <div className="flex flex-col gap-20">
        {WORK_ITEMS.map((item, itemIndex) => (
          <WorkItem
            key={item.id}
            index={item.index}
            title={t(item.titleKey)}
            meta={t(item.metaKey)}
            description={t(item.descriptionKey)}
            imageCaption={t(item.captionKey)}
            tags={item.tags}
            media={itemIndex % 2 === 0 ? 'start' : 'end'}
            action={
              <Button asChild variant="link" size="sm" className="self-start px-0">
                <a href={`mailto:${CONTACT_EMAIL}`}>{t('work.readCase')}</a>
              </Button>
            }
          />
        ))}
      </div>
    </SectionBlock>
  )
}
