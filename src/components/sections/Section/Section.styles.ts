import { styled } from 'next-yak'

import { spacing } from '@/styles/tokens.yak'

import { SECTION_PADDING } from './Section.constants'
import type { SectionSpacing } from './Section.types'

export const Root = styled.section<{ $align: 'left' | 'center'; $spacing: SectionSpacing; $width: number }>`
  position: relative;
  max-width: ${({ $width }) => `${String($width)}px`};
  margin: 0 auto;
  padding: ${({ $spacing }) => SECTION_PADDING[$spacing]} ${spacing[5]}px;
  display: flex;
  flex-direction: column;
  align-items: ${({ $align }) => ($align === 'center' ? 'center' : 'stretch')};
  text-align: ${({ $align }) => $align};
  gap: ${spacing[10]}px;
`
