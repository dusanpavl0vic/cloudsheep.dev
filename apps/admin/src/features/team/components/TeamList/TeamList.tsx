import { useTranslation } from 'react-i18next'
import { Link } from 'react-router'

import { ROUTES } from '@/lib/routes'
import { Button, Checkbox } from '@app/ui'

import type { TeamMember } from '../../types'

interface TeamListProps {
  members: readonly TeamMember[]
  onEdit: (member: TeamMember) => void
  onDelete: (member: TeamMember) => void
  onMove: (index: number, direction: -1 | 1) => void
  onToggleVisible: (member: TeamMember) => void
  isBusy: boolean
}

/** Inicijali kad avatara nema — obrazac iz `TechTile`, prazan krug izgleda kao greška. */
const initials = (fullName: string) =>
  fullName
    .split(' ')
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join('')

export const TeamList = ({
  members,
  onEdit,
  onDelete,
  onMove,
  onToggleVisible,
  isBusy,
}: TeamListProps) => {
  const { t } = useTranslation(['team', 'common'])

  return (
    <ul className="flex flex-col gap-2">
      {members.map((member, index) => (
        <li
          key={member.id}
          className="border-border bg-card flex flex-wrap items-center gap-4 rounded-xl border p-3"
        >
          <span className="border-border bg-muted text-muted-foreground flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border text-[14px] font-semibold">
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt=""
                width={44}
                height={44}
                className="size-full object-cover"
              />
            ) : (
              initials(member.fullName)
            )}
          </span>

          <span className="min-w-0 flex-1">
            <span className="text-foreground block font-semibold">{member.fullName}</span>
            <span className="text-muted-foreground block text-[13px]">
              {member.roleSr || t('team.list.noRole')}
            </span>
          </span>

          {/* Oznaka diplome je informacija, ne prekidač — menja se u formi, uz podatke */}
          <span
            className={
              member.hasDiploma
                ? 'bg-success/15 text-success rounded-full px-2.5 py-0.5 text-[12.5px] font-semibold'
                : 'bg-muted text-muted-foreground rounded-full px-2.5 py-0.5 text-[12.5px] font-semibold'
            }
          >
            {member.hasDiploma ? t('team.list.hasDiploma') : t('team.list.noDiploma')}
          </span>

          <label className="flex items-center gap-2 text-[14px]">
            <Checkbox
              checked={member.isVisible}
              disabled={isBusy}
              onChange={() => {
                onToggleVisible(member)
              }}
            />
            {t('team.list.visible')}
          </label>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              disabled={index === 0 || isBusy}
              aria-label={t('team.list.moveUp')}
              onClick={() => {
                onMove(index, -1)
              }}
            >
              ↑
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={index === members.length - 1 || isBusy}
              aria-label={t('team.list.moveDown')}
              onClick={() => {
                onMove(index, 1)
              }}
            >
              ↓
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onEdit(member)
              }}
            >
              {t('common:common.edit')}
            </Button>
            {/* CV je zasebna strana, ne još jedna sekcija u formi člana: nosi četiri
                kolekcije i duplo više polja od svega ostalog zajedno. */}
            <Button asChild variant="ghost" size="sm">
              <Link to={ROUTES.TEAM_CV.replace(':id', member.id)}>{t('team.list.cv')}</Link>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onDelete(member)
              }}
            >
              {t('common:common.delete')}
            </Button>
          </div>
        </li>
      ))}
    </ul>
  )
}
