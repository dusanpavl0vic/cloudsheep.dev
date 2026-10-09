import { css, keyframes, styled } from 'next-yak'

import { colors, spacing, zIndex } from '@/styles/tokens.yak'
const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

export const Backdrop = styled.div<{ $placement: 'center' | 'right' }>`
  position: fixed;
  inset: 0;
  z-index: ${zIndex.overlay};
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  ${({ $placement }) =>
    $placement === 'center' &&
    css`
      align-items: center;
      justify-content: center;
      padding: ${spacing[4]}px;
    `}
  background: ${colors.veil};
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
