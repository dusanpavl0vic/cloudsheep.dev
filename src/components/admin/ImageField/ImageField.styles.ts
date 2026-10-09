import { css, styled } from 'next-yak'

import { colors } from '@/styles/tokens.yak'

export const Root = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Label = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${colors.ink};
`

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`

export const Preview = styled.div<{ $round: boolean }>`
  display: grid;
  place-items: center;
  width: 72px;
  height: 72px;
  border-radius: 14px;
  border: 1px solid ${colors.line2};
  background: ${colors.muted};
  overflow: hidden;
  color: ${colors.faint};

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  ${({ $round }) =>
    $round &&
    css`
      border-radius: 50%;
      img {
        object-fit: cover;
      }
    `}
`
