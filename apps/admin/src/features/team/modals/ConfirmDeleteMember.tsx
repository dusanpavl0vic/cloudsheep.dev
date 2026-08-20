import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@app/ui'

interface ConfirmDeleteMemberProps {
  fullName: string
  onClose: (confirmed: boolean) => void
}

/** Default export — lazy modul u `modalRegistry` (docs/03). */
export default function ConfirmDeleteMember({ fullName, onClose }: ConfirmDeleteMemberProps) {
  const { t } = useTranslation(['team', 'common'])

  return (
    <Dialog
      open
      size="sm"
      dismissible={false}
      onClose={() => {
        onClose(false)
      }}
      title={t('team.delete.title')}
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
            {t('team.delete.confirm')}
          </Button>
        </>
      }
    >
      {t('team.delete.body', { fullName })}
    </Dialog>
  )
}
