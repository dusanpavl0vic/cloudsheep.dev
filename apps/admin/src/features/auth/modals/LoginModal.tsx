import { useTranslation } from 'react-i18next'

import { LoginForm } from '../components/LoginForm'

interface LoginModalProps {
  redirectTo?: string
  /** Modal VRAĆA rezultat; ne dispatch-uje domensku akciju sam (docs/06). */
  onClose: (result?: boolean) => void
}

/**
 * `default export` je ovde jedini dozvoljeni slučaj — `lazy()` ga zahteva (docs/03).
 */
export default function LoginModal({ onClose }: LoginModalProps) {
  const { t } = useTranslation('auth')

  return (
    <div className="w-full max-w-md">
      <h2 className="mb-4 font-heading text-xl font-bold text-foreground">
        {t('auth.modals.login.title')}
      </h2>
      <LoginForm
        onSuccess={() => {
          onClose(true)
        }}
      />
    </div>
  )
}
