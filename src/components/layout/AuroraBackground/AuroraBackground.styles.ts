'use client'

import styled, { css, keyframes } from 'styled-components'

import type { AuroraBlob } from './AuroraBackground.constants'

export const Root = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${({ theme }) => theme.zIndex.aurora};
  pointer-events: none;
  overflow: hidden;
`

const drift = (blob: AuroraBlob) => keyframes`
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(${blob.dx}, ${blob.dy}) scale(${String(blob.scale)}); }
`

export const Blob = styled.div<{ $blob: AuroraBlob }>`
  position: absolute;
  width: ${({ $blob }) => $blob.size};
  height: ${({ $blob }) => $blob.size};
  border-radius: 50%;
  background: ${({ theme, $blob }) => theme.colors[$blob.color]};
  filter: blur(${({ $blob }) => $blob.blur}px);
  ${({ $blob }) => css`
    ${'left' in $blob ? `left: ${$blob.left};` : ''}
    ${'right' in $blob ? `right: ${$blob.right};` : ''}
    ${'top' in $blob ? `top: ${$blob.top};` : ''}
    ${'bottom' in $blob ? `bottom: ${$blob.bottom};` : ''}
    animation: ${drift($blob)} ${$blob.durationS}s ease-in-out infinite alternate;
  `}
`

export const Veil = styled.div`
  position: absolute;
  inset: 0;
  background: ${({ theme }) => theme.colors.veil};
`
