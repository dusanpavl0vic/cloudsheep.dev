import { styled } from 'next-yak'

import { colors, radii, zIndex } from '@/styles/tokens.yak'
export const Root = styled.a`
  position: absolute;
  left: 16px;
  top: -60px;
  z-index: ${zIndex.toast};
  padding: 10px 16px;
  border-radius: ${radii.base}px;
  background: ${colors.primary};
  color: ${colors.onPrimary};
  font-weight: 600;
  transition: top 0.2s;

  &:focus {
    top: 12px;
  }
`
