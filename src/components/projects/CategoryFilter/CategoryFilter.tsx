import { useTranslations } from 'next-intl'

import { projectsHref } from '@/constants/routes'
import type { ProjectCategory } from '@/types/project'

import { Count, List, Option } from './CategoryFilter.styles'

interface CategoryFilterProps {
  /** Kategorije sa brojem projekata, redom kojim se prikazuju. */
  counts: Map<ProjectCategory, number>
  total: number
  active: ProjectCategory | null
}

/** Filter projekata po kategoriji — linkovi sa `?category=`, rade bez JS-a. */
const CategoryFilter = ({ counts, total, active }: CategoryFilterProps) => {
  const t = useTranslations('projects')
  const options: { key: ProjectCategory | null; label: string; count: number }[] = [
    { key: null, label: t('all'), count: total },
    ...[...counts].map(([key, count]) => ({ key, label: t(`categories.${key}`), count })),
  ]

  return (
    <nav aria-label={t('filterLabel')}>
      <List>
        {options.map((option) => (
          <li key={option.key ?? 'all'}>
            <Option
              href={projectsHref(option.key ?? undefined)}
              $active={option.key === active}
              aria-current={option.key === active ? 'page' : undefined}
              scroll={false}
            >
              {option.label}
              <Count>{option.count}</Count>
            </Option>
          </li>
        ))}
      </List>
    </nav>
  )
}

export default CategoryFilter
