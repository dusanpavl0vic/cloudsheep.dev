'use client'

import styled, { css } from 'styled-components'

import { focusRing, resetButton } from '@/styles/mixins'

/** Opruga iz dizajna (prebačaj pa smirivanje). */
const SPRING = 'cubic-bezier(.34, 1.56, .64, 1)'

export const Root = styled.button<{ $dark: boolean }>`
  ${resetButton};
  ${focusRing};
  width: 38px;
  height: 38px;
  flex-shrink: 0;
  display: grid;
  place-items: center;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.colors.line};
  background: ${({ theme }) => theme.colors.muted};
  color: ${({ theme }) => theme.colors.ink};
  transition:
    background 0.5s,
    color 0.5s;

  &:active {
    transform: scale(0.9);
  }
`

export const Svg = styled.svg<{ $dark: boolean }>`
  overflow: visible;
  transition: transform 0.7s ${SPRING};
  transform: rotate(${({ $dark }) => ($dark ? '-40deg' : '90deg')});
`

export const MaskCircle = styled.circle<{ $dark: boolean }>`
  transition:
    cx 0.6s ${SPRING},
    cy 0.6s ${SPRING};
  cx: ${({ $dark }) => ($dark ? 17 : 30)}px;
  cy: ${({ $dark }) => ($dark ? 7 : -6)}px;
`

export const Body = styled.circle<{ $dark: boolean }>`
  transition: r 0.6s ${SPRING};
  r: ${({ $dark }) => ($dark ? 9 : 5)}px;
`

export const Rays = styled.g<{ $dark: boolean }>`
  transform-origin: 12px 12px;
  transition:
    transform 0.6s ${SPRING},
    opacity 0.4s;
  ${({ $dark }) =>
    $dark
      ? css`
          transform: scale(0) rotate(-60deg);
          opacity: 0;
        `
      : css`
          transform: scale(1) rotate(0);
          opacity: 1;
        `}
`
