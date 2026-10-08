'use client'

import type { ReactNode } from 'react'

import IconButton from '@/components/buttons/IconButton'

import Overlay from '../Overlay'
import { Panel, Top } from './SideDrawer.styles'

interface SideDrawerProps {
  children: ReactNode
  onClose: () => void
  label: string
  closeLabel: string
  /** Sadržaj levo od dugmeta za zatvaranje (logotip). */
  header?: ReactNode
}

/** Panel sa desne ivice (mobilni meni). Zatvara se Esc-om, klikom na pozadinu i dugmetom. */
const SideDrawer = ({ children, onClose, label, closeLabel, header }: SideDrawerProps) => (
  <Overlay onClose={onClose} label={label} placement="right">
    <Panel>
      <Top>
        {header}
        <IconButton icon="close" label={closeLabel} onClick={() => { onClose(); }} />
      </Top>
      {children}
    </Panel>
  </Overlay>
)

export default SideDrawer
