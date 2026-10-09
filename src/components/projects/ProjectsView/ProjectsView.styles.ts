'use client'

import styled from 'styled-components'

export const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 360px), 1fr));
  gap: 22px;
`

export const Empty = styled.p`
  padding: 48px 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.faint};
`
