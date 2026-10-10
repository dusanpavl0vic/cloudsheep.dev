import { keyframes, styled } from 'next-yak'

import { glassStrong } from '@/styles/mixins'
import { radii, spacing } from '@/styles/tokens.yak'

const slideIn = keyframes`
  from { transform: translateX(24px); opacity: 0; }
  to { transform: none; opacity: 1; }
`

export const Panel = styled.div`
  ${glassStrong};
  width: min(360px, 100%);
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: ${spacing[6]}px;
  padding: ${spacing[5]}px;
  border-radius: ${radii.lg}px 0 0 ${radii.lg}px;
  animation: ${slideIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`

export const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
