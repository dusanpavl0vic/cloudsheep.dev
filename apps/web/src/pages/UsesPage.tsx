import { Cog, Keyboard, LayoutGrid, SquareTerminal } from 'lucide-react'
import type { ComponentType } from 'react'
import { useTranslation } from 'react-i18next'



import type { UsesIcon } from '@/features/uses/uses.constants'
import { USES_GROUPS } from '@/features/uses/uses.constants'
import { Container, PageHeader, Reveal } from '@app/ui'

const ICONS: Record<UsesIcon, ComponentType<{ className?: string }>> = {
  keyboard: Keyboard,
  terminal: SquareTerminal,
  cog: Cog,
  grid: LayoutGrid,
}

export const UsesPage = () => {
  const { t } = useTranslation(['uses', 'common'])

  return (
    <>
      <Container width="content" className="pt-22 pb-12">
        <Reveal>
          <PageHeader
            eyebrow={t('uses.eyebrow')}
            title={t('uses.title')}
            subtitle={t('uses.subtitle')}
          />
        </Reveal>
      </Container>

      <Container width="content" className="pb-24">
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          {USES_GROUPS.map((group) => {
            const Icon = ICONS[group.icon]
            return (
              <Reveal key={group.id} as="section" className="rounded-xl border border-border bg-card p-8">
                <div className="mb-5 flex items-center gap-3">
                  <Icon className="size-[22px] text-primary" />
                  <h2 className="font-heading text-[22px] font-semibold tracking-tight text-foreground">
                    {t(group.titleKey)}
                  </h2>
                </div>
                <ul className="flex flex-col">
                  {group.items.map((item, index) => (
                    <li
                      key={item.name}
                      className={`flex items-baseline justify-between gap-4 py-2.5 ${
                        index < group.items.length - 1 ? 'border-b border-border' : ''
                      }`}
                    >
                      <span className="text-[15px] font-semibold text-foreground">{item.name}</span>
                      <span className="text-right text-[14px] text-faint">{t(item.noteKey)}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )
          })}
        </div>
      </Container>
    </>
  )
}
