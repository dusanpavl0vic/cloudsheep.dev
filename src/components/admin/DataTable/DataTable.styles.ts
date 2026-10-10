import { css, styled } from 'next-yak'

import { glassStrong, visuallyHidden } from '@/styles/mixins'
import { colors, fonts, media } from '@/styles/tokens.yak'

export const Wrap = styled.div`
  ${glassStrong};
  border-radius: 18px;
  overflow-x: auto;
`

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14.5px;
`

export const Caption = styled.caption`
  ${visuallyHidden};
`

export const Head = styled.th<{ $wide: boolean; $right: boolean }>`
  padding: 12px 16px;
  text-align: left;
  font-family: ${fonts.mono};
  font-size: 11.5px;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${colors.faint};
  border-bottom: 1px solid ${colors.line};
  white-space: nowrap;

  ${({ $right }) =>
    $right &&
    css`
      text-align: right;
    `}

  ${({ $wide }) =>
    $wide &&
    css`
      display: none;
      ${media.tablet} {
        display: table-cell;
      }
    `}
`

export const Row = styled.tr<{ $highlight: boolean }>`
  &:not(:last-child) td {
    border-bottom: 1px solid ${colors.line};
  }

  ${({ $highlight }) =>
    $highlight &&
    css`
      td {
        font-weight: 700;
      }
    `}
`

export const Cell = styled.td<{ $wide: boolean; $right: boolean }>`
  padding: 12px 16px;
  vertical-align: middle;
  color: ${colors.ink};

  ${({ $right }) =>
    $right &&
    css`
      text-align: right;
      white-space: nowrap;
    `}

  ${({ $wide }) =>
    $wide &&
    css`
      display: none;
      ${media.tablet} {
        display: table-cell;
      }
    `}
`

export const Empty = styled.p`
  padding: 40px 16px;
  text-align: center;
  color: ${colors.faint};
`
