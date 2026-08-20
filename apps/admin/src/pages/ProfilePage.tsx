import { useTranslation } from 'react-i18next'

import { SkeletonForm } from '@/components/Skeleton'
import { ProfileForm, SocialLinks, useProfile } from '@/features/profile'
import { PageHeader } from '@app/ui'

/** Stranica je SAMO kompozicija — nema state, nema selektora (docs/02). */
export function ProfilePage() {
  const { t } = useTranslation('profile')
  const { profile, links, save, isLoading, isSaving, error } = useProfile()

  if (isLoading) return <SkeletonForm fields={7} label={t('profile.loading')} />

  return (
    <>
      <PageHeader className="mb-8" title={t('profile.title')} subtitle={t('profile.subtitle')} />

      {error && <p role="alert">{t('profile.loadError')}</p>}

      <ProfileForm profile={profile} isSaving={isSaving} onSubmit={save} />

      <h2 className="font-heading text-foreground mt-10 mb-4 text-lg font-semibold">
        {t('profile.links.title')}
      </h2>
      <SocialLinks links={links} />
    </>
  )
}
