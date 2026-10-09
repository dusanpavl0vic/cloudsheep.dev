'use client'

import { useId } from 'react'

import Button from '@/components/buttons/Button'
import type { IconName } from '@/constants/icons'

import { FileInput } from './UploadButton.styles'

interface UploadButtonProps {
  label: string
  onPick: (file: File | undefined) => void
  isUploading: boolean
  icon?: IconName
  variant?: 'secondary' | 'primary'
}

const ACCEPT = 'image/png,image/jpeg,image/webp,image/gif,image/svg+xml'

/** Dugme koje otvara izbor slike (skriven `<input type="file">`, isti fajl može ponovo). */
const UploadButton = ({ label, onPick, isUploading, icon = 'upload', variant = 'secondary' }: UploadButtonProps) => {
  const inputId = useId()
  return (
    <>
      <FileInput
        id={inputId}
        type="file"
        accept={ACCEPT}
        tabIndex={-1}
        aria-hidden="true"
        onChange={(event) => {
          onPick(event.currentTarget.files?.[0])
          event.currentTarget.value = ''
        }}
      />
      <Button
        variant={variant}
        size="s"
        iconLeft={icon}
        loading={isUploading}
        onClick={() => {
          document.getElementById(inputId)?.click()
        }}
      >
        {label}
      </Button>
    </>
  )
}

export default UploadButton
