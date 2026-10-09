import { styled } from 'next-yak'

import { colors, fonts } from '@/styles/tokens.yak'

export const Title = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-weight: 700;

  img,
  i {
    width: 56px;
    height: 36px;
    border-radius: 8px;
    object-fit: cover;
    background: ${colors.muted};
  }
`

export const Year = styled.span`
  font-family: ${fonts.mono};
  font-size: 13px;
`

export const Toggles = styled.span`
  display: inline-flex;
  flex-wrap: wrap;
  gap: 4px;
`
