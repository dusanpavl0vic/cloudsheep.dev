import { useTranslation } from 'react-i18next'

import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@app/ui'

import type { Technology } from '../../types'

interface TechnologiesTableProps {
  technologies: readonly Technology[]
  onEdit: (technology: Technology) => void
  onDelete: (technology: Technology) => void
  isDeleting: boolean
}

export const TechnologiesTable = ({
  technologies,
  onEdit,
  onDelete,
  isDeleting,
}: TechnologiesTableProps) => {
  const { t } = useTranslation(['technologies', 'common'])

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t('technologies.table.logo')}</TableHead>
          <TableHead>{t('technologies.table.label')}</TableHead>
          <TableHead>{t('technologies.table.group')}</TableHead>
          <TableHead className="text-end">{t('technologies.table.actions')}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {technologies.map((technology) => (
          <TableRow key={technology.id}>
            <TableCell>
              {technology.logoUrl ? (
                <img
                  src={technology.logoUrl}
                  alt=""
                  width={24}
                  height={24}
                  className="size-6 object-contain"
                />
              ) : (
                // Tehnologija bez logotipa nije greška — prikazuje se samo kao naziv
                <span aria-hidden className="text-muted-foreground">
                  —
                </span>
              )}
            </TableCell>
            <TableCell>
              <span className="text-foreground font-semibold">{technology.label}</span>
              <span className="text-muted-foreground block text-[13px]">{technology.slug}</span>
            </TableCell>
            <TableCell>{t(`technologies.groups.${technology.group}`)}</TableCell>
            <TableCell>
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onEdit(technology)
                  }}
                >
                  {t('common:common.edit')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() => {
                    onDelete(technology)
                  }}
                >
                  {t('common:common.delete')}
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
