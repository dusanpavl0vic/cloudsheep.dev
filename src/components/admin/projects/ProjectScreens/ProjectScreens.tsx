'use client'

import { useTranslations } from 'next-intl'
import type { ChangeEvent, FocusEvent } from 'react'

import OrderButtons from '@/components/admin/OrderButtons'
import Panel from '@/components/admin/Panel'
import UploadButton from '@/components/admin/UploadButton'
import IconButton from '@/components/buttons/IconButton'
import TextField from '@/components/inputs/TextField'
import { useProjectScreens } from '@/hooks/admin/projects'
import { DEVICE_KINDS, type AdminProject, type DeviceKind } from '@/types/project'

import { Card, Grid, Hint, Row } from './ProjectScreens.styles'

const ALTS = ['altEn', 'altSr'] as const

/** Ekrani postojećeg projekta: otpremi, uređaj (okvir), opis, redosled, brisanje — čuva se odmah. */
const Screens = ({ project }: { project: AdminProject }) => {
  const t = useTranslations('admin')
  const screens = useProjectScreens(project)

  return (
    <>
      <Grid>
        {screens.items.map((image, index) => (
          <Card key={image.id}>
            <img src={image.url} alt="" width={image.width} height={image.height} />
            <TextField
              id={`scr-${image.id}-device`}
              label={t('projects.device')}
              value={image.device ?? ''}
              onChange={(event: ChangeEvent<HTMLSelectElement>) => void screens.setDevice(image, (event.currentTarget.value || null) as DeviceKind | null)}
              options={[{ value: '', label: t('projects.devices.none') }, ...DEVICE_KINDS.map((value) => ({ value, label: t(`projects.devices.${value}`) }))]}
            />
            {ALTS.map((field) => (
              <TextField
                key={field}
                id={`scr-${image.id}-${field}`}
                label={t(`projects.${field}`)}
                defaultValue={image[field]}
                onBlur={(event: FocusEvent<HTMLInputElement>) => void screens.setAlt(image, field, event.currentTarget.value)}
              />
            ))}
            <Row>
              <OrderButtons
                name={image.altEn || String(index + 1)}
                canUp={screens.order.canMove(index, -1)}
                canDown={screens.order.canMove(index, 1)}
                onMove={(delta) => {
                  screens.order.move(index, delta)
                }}
              />
              <IconButton icon="trash" size="s" label={t('common.delete')} onClick={() => void screens.remove(image)} />
            </Row>
          </Card>
        ))}
      </Grid>
      <div>
        <UploadButton label={t('projects.addScreen')} icon="plus" onPick={(file) => void screens.upload.pick(file)} isUploading={screens.upload.isUploading} />
      </div>
    </>
  )
}

/** Ekrani se dodaju tek posle prvog čuvanja — slika se vezuje za postojeći projekat. */
const ProjectScreens = ({ project }: { project: AdminProject | undefined }) => {
  const t = useTranslations('admin.projects')
  return <Panel title={t('sections.screens')}>{project ? <Screens project={project} /> : <Hint>{t('saveFirst')}</Hint>}</Panel>
}

export default ProjectScreens
