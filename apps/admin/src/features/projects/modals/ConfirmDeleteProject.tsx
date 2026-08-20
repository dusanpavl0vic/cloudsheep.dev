import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@app/ui'

interface ConfirmDeleteProjectProps {
  projectTitle: string
  /** `true` = potvrđeno. Rezultat stiže onome ko je `await`-ovao `open()`. */
  onClose: (confirmed: boolean) => void
}

/**
 * Potvrda brisanja. **Default export** — lazy modul u `modalRegistry` (docs/03).
 *
 * Nema `useState(false)` ni `isOpen` props: otvorenost drži Redux modal engine, a rezultat
 * se vraća kroz `onClose` koji razrešava obećanje iz `open()` (ADR 0006).
 *
 * `dismissible={false}` — `Esc` i klik po pozadini ovde ne prolaze: brisanje je nepovratno,
 * pa mora postojati odluka, ne izmicanje.
 */
export default function ConfirmDeleteProject({ projectTitle, onClose }: ConfirmDeleteProjectProps) {
  const { t } = useTranslation(['projects', 'common'])

  return (
    <Dialog
      open
      size="sm"
      dismissible={false}
      onClose={() => {
        onClose(false)
      }}
      title={t('projects.delete.title')}
      footer={
        <>
          <Button
            variant="ghost"
            onClick={() => {
              onClose(false)
            }}
          >
            {t('common:common.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onClose(true)
            }}
          >
            {t('projects.delete.confirm')}
          </Button>
        </>
      }
    >
      {t('projects.delete.body', { title: projectTitle })}
    </Dialog>
  )
}
