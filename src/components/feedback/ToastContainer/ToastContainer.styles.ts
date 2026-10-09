import { styled } from 'next-yak'

import { spacing, zIndex } from '@/styles/tokens.yak'
export const Root = styled.div`
  position: fixed;
  right: ${spacing[4]}px;
  bottom: ${spacing[4]}px;
  z-index: ${zIndex.toast};
  display: grid;
  gap: ${spacing[2]}px;
`
