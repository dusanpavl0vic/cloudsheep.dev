import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { Button, Checkbox, EmptyState, FormField, Input } from '@app/ui'

import { useSocialLinks } from '../../hooks/useSocialLinks'
import { socialLinkSchema, type SocialLinkInput } from '../../schemas/profile.schema'
import type { SocialLink } from '../../types'

const EMPTY: SocialLinkInput = { platform: '', url: '', label: '', isVisible: true }

interface SocialLinksProps {
  links: readonly SocialLink[]
}

/**
 * Kontakt linkovi: dodavanje, redosled, sakrivanje, brisanje.
 *
 * Sakrivanje umesto brisanja postoji jer je link često privremeno nepoželjan (nedovršen
 * profil), a brisanje bi značilo ponovno kucanje adrese.
 */
export const SocialLinks = ({ links }: SocialLinksProps) => {
  const { t } = useTranslation(['profile', 'common'])
  const { add, toggleVisible, move, removeLink, isAdding } = useSocialLinks()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SocialLinkInput>({
    resolver: zodResolver(socialLinkSchema),
    mode: 'onTouched',
    defaultValues: EMPTY,
  })

  const submit = handleSubmit(async (values) => {
    const result = await add(values)
    // `reset()`, ne `useState` — forma se prazni tek kad je link zaista sačuvan
    if (result.ok) reset(EMPTY)
  })

  const busy = isAdding || isSubmitting

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      {links.length === 0 ? (
        <EmptyState title={t('profile.links.empty')} description={t('profile.links.emptyBody')} />
      ) : (
        <ul className="flex flex-col gap-2">
          {links.map((link, index) => (
            <li
              key={link.id}
              className="border-border bg-card flex flex-wrap items-center gap-3 rounded-xl border p-3"
            >
              <span className="text-muted-foreground w-24 shrink-0 font-mono text-[13px]">
                {link.platform}
              </span>
              <span className="min-w-0 flex-1">
                <span className="text-foreground block font-semibold">{link.label}</span>
                <span className="text-muted-foreground block truncate text-[13px]">{link.url}</span>
              </span>

              <label className="flex items-center gap-2 text-[14px]">
                <Checkbox
                  checked={link.isVisible}
                  onChange={() => {
                    toggleVisible(link)
                  }}
                />
                {t('profile.links.visible')}
              </label>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={index === 0}
                  aria-label={t('profile.links.moveUp')}
                  onClick={() => {
                    move(links, index, -1)
                  }}
                >
                  ↑
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={index === links.length - 1}
                  aria-label={t('profile.links.moveDown')}
                  onClick={() => {
                    move(links, index, 1)
                  }}
                >
                  ↓
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    removeLink(link.id)
                  }}
                >
                  {t('common:common.delete')}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form
        noValidate
        onSubmit={(event) => void submit(event)}
        className="border-border flex flex-col gap-4 rounded-xl border border-dashed p-4"
        aria-busy={busy}
      >
        <div className="grid gap-4 sm:grid-cols-3">
          <FormField
            label={t('profile.links.platform')}
            description={t('profile.links.platformHint')}
            {...(errors.platform && { error: t(errors.platform.message ?? '') })}
          >
            {(field) => <Input {...field} {...register('platform')} />}
          </FormField>

          <FormField
            label={t('profile.links.label')}
            {...(errors.label && { error: t(errors.label.message ?? '') })}
          >
            {(field) => <Input {...field} {...register('label')} />}
          </FormField>

          <FormField
            label={t('profile.links.url')}
            description={t('profile.links.urlHint')}
            {...(errors.url && { error: t(errors.url.message ?? '') })}
          >
            {(field) => <Input {...field} {...register('url')} />}
          </FormField>
        </div>

        <div>
          <Button type="submit" disabled={busy}>
            {t('profile.links.add')}
          </Button>
        </div>
      </form>
    </div>
  )
}
