import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@app/ui'

interface ConfirmDeleteTechnologyProps {
  label: string
  onClose: (confirmed: boolean) => void
}

/** Default export — lazy modul u `modalRegistry` (docs/03). */
export default function ConfirmDeleteTechnology({ label, onClose }: ConfirmDeleteTechnologyProps) {
  const { t } = useTranslation(['technologies', 'common'])

  return (
    <Dialog
      open
      size="sm"
      dismissible={false}
      onClose={() => {
        onClose(false)
      }}
      title={t('technologies.delete.title')}
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
            {t('technologies.delete.confirm')}
          </Button>
        </>
      }
    >
      {t('technologies.delete.body', { label })}
    </Dialog>
  )
}
