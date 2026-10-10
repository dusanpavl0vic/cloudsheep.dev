import { styled } from 'next-yak'

import { colors, fonts } from '@/styles/tokens.yak'

export const Name = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-weight: 600;

  img {
    width: 28px;
    height: 28px;
    object-fit: contain;
  }
`

export const Placeholder = styled.span`
  display: inline-block;
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: ${colors.muted};
`

export const Slug = styled.code`
  font-family: ${fonts.mono};
  font-size: 13px;
  color: ${colors.faint};
`
