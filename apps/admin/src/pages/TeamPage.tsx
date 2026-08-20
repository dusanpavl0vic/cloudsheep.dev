import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router'

import { SkeletonList } from '@/components/Skeleton'
import { TeamList, TeamMemberForm, useTeam } from '@/features/team'
import { QUERY } from '@/lib/routes'
import { Button, EmptyState, PageHeader } from '@app/ui'

/**
 * Lista i forma na istoj strani; koji se član uređuje stoji u URL-u (`?izmena=<id>`).
 *
 * Isti obrazac kao kod tehnologija — zasebna ruta bi značila da se posle svakog čuvanja
 * gubi pregled tima (docs/04: stanje koje pripada adresi ide u adresu).
 */
export function TeamPage() {
  const { t } = useTranslation(['team', 'common'])
  const [params, setParams] = useSearchParams()

  const { members, save, toggleVisible, move, confirmDelete, isLoading, isSaving, isBusy, error } =
    useTeam()

  const editingId = params.get(QUERY.EDIT)
  const editing = members.find((member) => member.id === editingId)
  const showForm = params.has(QUERY.NEW) || Boolean(editing)

  const closeForm = () => {
    setParams({}, { replace: true })
  }

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-4">
        <PageHeader title={t('team.title')} subtitle={t('team.subtitle')} />
        {!showForm && (
          <Button
            onClick={() => {
              setParams({ [QUERY.NEW]: '1' }, { replace: true })
            }}
          >
            {t('team.new')}
          </Button>
        )}
      </div>

      {showForm && (
        <div className="mb-10">
          <h2 className="font-heading text-foreground mb-4 text-lg font-semibold">
            {editing ? t('team.editTitle') : t('team.newTitle')}
          </h2>
          <TeamMemberForm
            {...(editing ? { member: editing } : {})}
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

      {isLoading && <SkeletonList rows={4} label={t('team.loading')} />}
      {error && <p role="alert">{t('team.loadError')}</p>}

      {!isLoading && !error && members.length === 0 && !showForm && (
        <EmptyState
          title={t('team.empty.title')}
          description={t('team.empty.body')}
          action={
            <Button
              onClick={() => {
                setParams({ [QUERY.NEW]: '1' }, { replace: true })
              }}
            >
              {t('team.empty.action')}
            </Button>
          }
        />
      )}

      {members.length > 0 && (
        <TeamList
          members={members}
          isBusy={isBusy}
          onToggleVisible={toggleVisible}
          onMove={(index, direction) => {
            move(members, index, direction)
          }}
          onEdit={(member) => {
            setParams({ [QUERY.EDIT]: member.id }, { replace: true })
          }}
          onDelete={(member) => {
            void confirmDelete(member)
          }}
        />
      )}
    </>
  )
}
