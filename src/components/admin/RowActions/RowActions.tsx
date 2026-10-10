'use client'

import { useTranslations } from 'next-intl'

import IconButton from '@/components/buttons/IconButton'

import { Root } from './RowActions.styles'

interface RowActionsProps {
  /** Ime stavke za čitač ekrana („Izmeni: React"). */
  name: string
  onEdit?: () => void
  onDelete: () => void
}

/** Izmeni / obriši na kraju reda tabele. */
const RowActions = ({ name, onEdit, onDelete }: RowActionsProps) => {
  const t = useTranslations('admin.common')
  return (
    <Root>
      {onEdit && <IconButton icon="edit" size="s" label={`${t('edit')}: ${name}`} onClick={onEdit} />}
      <IconButton icon="trash" size="s" label={`${t('delete')}: ${name}`} onClick={onDelete} />
    </Root>
  )
}

export default RowActions
