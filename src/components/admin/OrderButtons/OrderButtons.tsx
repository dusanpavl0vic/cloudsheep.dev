'use client'

import { useTranslations } from 'next-intl'

import IconButton from '@/components/buttons/IconButton'

interface OrderButtonsProps {
  /** Ime stavke za čitač ekrana („Pomeri gore: React"). */
  name: string
  canUp: boolean
  canDown: boolean
  onMove: (delta: -1 | 1) => void
}

/** Gore/dole — redosled bez prevlačenja, pa radi i tastaturom i čitačem ekrana. */
const OrderButtons = ({ name, canUp, canDown, onMove }: OrderButtonsProps) => {
  const t = useTranslations('admin.common')
  return (
    <span>
      <IconButton
        icon="chevronUp"
        size="s"
        label={`${t('moveUp')}: ${name}`}
        disabled={!canUp}
        onClick={() => {
          onMove(-1)
        }}
      />
      <IconButton
        icon="chevronDown"
        size="s"
        label={`${t('moveDown')}: ${name}`}
        disabled={!canDown}
        onClick={() => {
          onMove(1)
        }}
      />
    </span>
  )
}

export default OrderButtons
