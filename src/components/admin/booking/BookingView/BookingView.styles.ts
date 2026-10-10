import { styled } from 'next-yak'

import { colors, fonts, media } from '@/styles/tokens.yak'

export const Layout = styled.div`
  display: grid;
  gap: 24px;
  align-items: start;

  ${media.desktop} {
    grid-template-columns: minmax(0, 1fr) 380px;
  }
`

export const When = styled.span`
  font-family: ${fonts.mono};
  font-size: 13.5px;
  white-space: nowrap;
`

export const Client = styled.span`
  display: flex;
  flex-direction: column;

  small {
    font-size: 12.5px;
    color: ${colors.faint};
  }
`

export const RowActions = styled.span`
  display: inline-flex;
  gap: 6px;
`

export const Status = styled.p`
  padding: 40px 0;
  text-align: center;
  color: ${colors.faint};
`
