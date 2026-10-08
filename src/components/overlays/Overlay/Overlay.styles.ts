'use client'

import styled, { keyframes } from 'styled-components'

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

export const Backdrop = styled.div<{ $placement: 'center' | 'right' }>`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.overlay};
  display: flex;
  align-items: ${({ $placement }) => ($placement === 'center' ? 'center' : 'stretch')};
  justify-content: ${({ $placement }) => ($placement === 'center' ? 'center' : 'flex-end')};
  padding: ${({ $placement, theme }) => ($placement === 'center' ? `${String(theme.spacing[4])}px` : '0')};
  background: ${({ theme }) => theme.colors.veil};
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  animation: ${fadeIn} 0.2s ease-out;
`

/** Nosilac `role="dialog"` — pravi element (ne `display: contents`, koji Safari izbacuje iz a11y stabla). */
export const Dialog = styled.div<{ $placement: 'center' | 'right' }>`
  display: flex;
  max-width: 100%;
  max-height: 100%;
  height: ${({ $placement }) => ($placement === 'right' ? '100%' : 'auto')};
  outline: none;
`
