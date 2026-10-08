'use client'

import styled from 'styled-components'

import { BRAND_COLORS } from '@/constants/theme'

export const Bar = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  height: 2px;
  width: 0;
  background: linear-gradient(90deg, ${BRAND_COLORS.deep}, ${BRAND_COLORS.blue}, ${BRAND_COLORS.sky});
  pointer-events: none;
`
