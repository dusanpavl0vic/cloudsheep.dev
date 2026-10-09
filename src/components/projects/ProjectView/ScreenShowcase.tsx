'use client'

import { useState } from 'react'

import Chip from '@/components/buttons/Chip'
import { EFFECT_ATTRS } from '@/constants/effects'
import type { ImageRef } from '@/types/media'
import type { DeviceKind } from '@/types/project'

import { Browser, BrowserBar, BrowserScreen, Divider, Light, Panel, Phone, PhoneScreen, Shot, Tabs, Url } from './ScreenShowcase.styles'

interface ScreenShowcaseProps {
  screens: Record<DeviceKind, ImageRef[]>
  /** Adresa u traci pregledača (`booksphere.app`). */
  host: string
  labels: { region: string; device: Record<DeviceKind, string>; screen: string[] }
}

const LIGHTS = [0, 1, 2] as const

/** Ekrani proizvoda u okviru telefona ili pregledača (dizajn: studija slučaja). */
const ScreenShowcase = ({ screens, host, labels }: ScreenShowcaseProps) => {
  const devices = (['phone', 'browser'] as const).filter((device) => screens[device].length > 0)
  const [device, setDevice] = useState<DeviceKind>(devices[0] ?? 'phone')
  const [index, setIndex] = useState(0)
  const list = screens[device]
  const current = list[Math.min(index, list.length - 1)]
  if (!current) return null

  const shot = <Shot src={current.url} alt={current.alt} width={current.width} height={current.height} loading="lazy" />

  return (
    <Panel aria-label={labels.region} {...{ [EFFECT_ATTRS.reveal]: '' }}>
      {(devices.length > 1 || list.length > 1) && (
        <Tabs>
          {devices.length > 1 &&
            devices.map((option) => (
              <Chip
                key={option}
                selected={device === option}
                onClick={() => {
                  setDevice(option)
                  setIndex(0)
                }}
              >
                {labels.device[option]}
              </Chip>
            ))}
          {devices.length > 1 && list.length > 1 && <Divider aria-hidden="true" />}
          {list.length > 1 &&
            list.map((screen, position) => (
              <Chip
                key={screen.url}
                selected={position === index}
                onClick={() => {
                  setIndex(position)
                }}
              >
                {labels.screen[position]}
              </Chip>
            ))}
        </Tabs>
      )}
      {device === 'phone' ? (
        <Phone>
          <PhoneScreen>{shot}</PhoneScreen>
        </Phone>
      ) : (
        <Browser>
          <BrowserBar>
            {LIGHTS.map((light) => (
              <Light key={light} aria-hidden="true" />
            ))}
            <Url>{host}</Url>
          </BrowserBar>
          <BrowserScreen>{shot}</BrowserScreen>
        </Browser>
      )}
    </Panel>
  )
}

export default ScreenShowcase
