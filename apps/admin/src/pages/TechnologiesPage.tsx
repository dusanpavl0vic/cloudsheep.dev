import { useTranslation } from 'react-i18next'
import { useNavigate, useSearchParams } from 'react-router'

import { SkeletonList } from '@/components/Skeleton'
import {
  TechnologiesTable,
  TechnologyForm,
  useTechnologies,
  useTechnologyMutations,
} from '@/features/technologies'
import { QUERY, ROUTES } from '@/lib/routes'
import { Button, EmptyState, PageHeader } from '@app/ui'

/**
 * Lista i forma na istoj strani.
 *
 * Tehnologija ima četiri polja; zasebna ruta za izmenu bi značila da se posle svakog
 * dodavanja gubi pregled liste. Koja se uređuje stoji u URL-u (`?izmena=<id>`), pa je i
 * ovde stanje u adresi, a ne u `useState` (docs/04).
 */
export function TechnologiesPage() {
  const { t } = useTranslation(['technologies', 'common'])
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  const { technologies, isLoading, error } = useTechnologies()
  const { save, confirmDelete, isSaving, isDeleting } = useTechnologyMutations()

  const editingId = params.get(QUERY.EDIT)
  const isCreating = params.has(QUERY.NEW)
  const editing = technologies.find((tech) => tech.id === editingId)
  const showForm = isCreating || Boolean(editing)

  const closeForm = () => {
    setParams({}, { replace: true })
  }

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-4">
        <PageHeader title={t('technologies.title')} subtitle={t('technologies.subtitle')} />
        {!showForm && (
          <Button
            onClick={() => {
              setParams({ [QUERY.NEW]: '1' }, { replace: true })
            }}
          >
            {t('technologies.new')}
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-8">
          <h2 className="font-heading text-foreground mb-4 text-lg font-semibold">
            {editing ? t('technologies.editTitle') : t('technologies.newTitle')}
          </h2>
          <TechnologyForm
            {...(editing ? { technology: editing } : {})}
            isSaving={isSaving}
            onCancel={closeForm}
            onSubmit={async (values) => {
              const result = await save(values, editing?.id)
              if (result.ok) closeForm()
              return result
            }}
          />
        </div>
      )}

      {isLoading && <SkeletonList rows={6} label={t('technologies.loading')} />}
      {error && <p role="alert">{t('technologies.loadError')}</p>}

      {!isLoading && !error && technologies.length === 0 && !showForm && (
        <EmptyState
          title={t('technologies.empty.title')}
          description={t('technologies.empty.body')}
          action={
            <Button
              onClick={() => {
                setParams({ [QUERY.NEW]: '1' }, { replace: true })
              }}
            >
              {t('technologies.empty.action')}
            </Button>
          }
        />
      )}

      {technologies.length > 0 && (
        <TechnologiesTable
          technologies={technologies}
          isDeleting={isDeleting}
          onEdit={(technology) => {
            setParams({ [QUERY.EDIT]: technology.id }, { replace: true })
          }}
          onDelete={(technology) => {
            void confirmDelete(technology.id, technology.label).then(() => {
              // Ako se brisala baš ona koja je otvorena u formi, forma se zatvara
              if (technology.id === editingId) void navigate(ROUTES.TECHNOLOGIES, { replace: true })
            })
          }}
        />
      )}
    </>
  )
}
