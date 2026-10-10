'use client'

import { useTranslations } from 'next-intl'

import ListStatus from '@/components/admin/ListStatus'
import PageHeader from '@/components/admin/PageHeader'
import { useProfilePage } from '@/hooks/admin/profile'

import ProfileForm from '../ProfileForm'
import SocialLinks from '../SocialLinks'
import { Stack } from './ProfileView.styles'

/** `/admin/profile` — profil studija i kontakt linkovi. */
const ProfileView = () => {
  const t = useTranslations('admin')
  const page = useProfilePage()

  return (
    <>
      <PageHeader title={t('nav.profile')} lead={t('profile.lead')} />
      <ListStatus isLoading={page.isLoading} isError={page.isError}>
        {page.data && (
          <Stack>
            <ProfileForm profile={page.data.profile} />
            <SocialLinks links={page.data.links} />
          </Stack>
        )}
      </ListStatus>
    </>
  )
}

export default ProfileView
