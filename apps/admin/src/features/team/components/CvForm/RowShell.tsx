import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@app/ui'

import { emptyVariants, rowHeadVariants, rowTitleVariants, rowVariants } from './CvForm.variants'

interface RowShellProps {
  /** „Posao 1", „Projekat 2" — redni broj, ne sadržaj. Sadržaj se vidi u poljima ispod. */
  title: string
  onRemove: () => void
  children: ReactNode
}

/**
 * Okvir jednog reda kolekcije, sa dugmetom za brisanje.
 *
 * Postoji da četiri kolekcije ne bi svaka pisala isti `<div>` sa istim rasporedom — a i da
 * bi dugme „ukloni" svuda stajalo na istom mestu. U formi sa dvadeset polja, dugme koje se
 * seli je dugme koje se pritisne greškom.
 */
export const RowShell = ({ title, onRemove, children }: RowShellProps) => {
  const { t } = useTranslation(['cv', 'common'])

  return (
    <div className={rowVariants()}>
      <div className={rowHeadVariants()}>
        <span className={rowTitleVariants()}>{title}</span>
        <Button type="button" variant="ghost" size="sm" onClick={onRemove}>
          {t('cv.form.remove')}
        </Button>
      </div>
      {children}
    </div>
  )
}

/** Poruka kad kolekcija nema nijednu stavku. Prazan prostor izgleda kao greška u učitavanju. */
export const EmptyRows = ({ label }: { label: string }) => (
  <p className={emptyVariants()}>{label}</p>
)
