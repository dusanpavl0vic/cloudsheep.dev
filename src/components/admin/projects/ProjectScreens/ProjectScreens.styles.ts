import { styled } from 'next-yak'

import { colors, media } from '@/styles/tokens.yak'

export const Grid = styled.ul`
  display: grid;
  gap: 16px;

  ${media.tablet} {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  ${media.desktop} {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`

export const Card = styled.li`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 14px;
  border: 1px solid ${colors.line};
  border-radius: 14px;

  img {
    width: 100%;
    aspect-ratio: 16 / 10;
    object-fit: contain;
    border-radius: 10px;
    background: ${colors.muted};
  }
`

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
`

export const Hint = styled.p`
  color: ${colors.faint};
`
