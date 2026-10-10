import { css, styled } from 'next-yak'

import Slot from '@/components/foundations/Slot'
import { focusRing, glassStrong } from '@/styles/mixins'
import { colors, fonts, media } from '@/styles/tokens.yak'

export const Stats = styled.ul`
  display: grid;
  gap: 14px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  ${media.desktop} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

export const Stat = styled(Slot)<{ $alert: boolean }>`
  ${glassStrong};
  ${focusRing};
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px 22px;
  border-radius: 18px;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }

  strong {
    font-family: ${fonts.mono};
    font-size: clamp(1.8rem, 3vw, 2.4rem);
    color: ${colors.display};
  }

  span {
    font-size: 14px;
    color: ${colors.ink2};
  }

  ${({ $alert }) =>
    $alert &&
    css`
      border-color: ${colors.danger};
      strong {
        color: ${colors.danger};
      }
    `}
`

export const Alert = styled.p`
  margin-top: 16px;
  font-size: 14px;
  color: ${colors.danger};
`

export const Calls = styled.ul`
  display: flex;
  flex-direction: column;

  li {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 4px 16px;
    padding: 12px 0;
  }

  li + li {
    border-top: 1px solid ${colors.line};
  }

  time {
    font-family: ${fonts.mono};
    font-size: 13.5px;
  }

  small {
    color: ${colors.faint};
  }
`

export const Layout = styled.div`
  display: grid;
  gap: 24px;
  align-items: start;

  ${media.desktop} {
    grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  }
`

export const Muted = styled.p`
  color: ${colors.faint};
`
