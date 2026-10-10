import { styled } from 'next-yak'

import { anim, colors, zIndex } from '@/styles/tokens.yak'

import type { AuroraBlob } from './AuroraBackground.constants'

export const Root = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${zIndex.aurora};
  pointer-events: none;
  overflow: hidden;
`

/** Položaj i putanja su vrednosti mrlje; animacija je jedna (`anim.auroraDrift`), sa promenljivama. */
export const Blob = styled.div<{ $blob: AuroraBlob }>`
  position: absolute;
  width: ${({ $blob }) => $blob.size};
  height: ${({ $blob }) => $blob.size};
  left: ${({ $blob }) => ('left' in $blob ? $blob.left : 'auto')};
  right: ${({ $blob }) => ('right' in $blob ? $blob.right : 'auto')};
  top: ${({ $blob }) => ('top' in $blob ? $blob.top : 'auto')};
  bottom: ${({ $blob }) => ('bottom' in $blob ? $blob.bottom : 'auto')};
  border-radius: 50%;
  background: ${({ $blob }) => $blob.color};
  filter: blur(${({ $blob }) => `${String($blob.blur)}px`});
  --aurora-dx: ${({ $blob }) => $blob.dx};
  --aurora-dy: ${({ $blob }) => $blob.dy};
  --aurora-scale: ${({ $blob }) => String($blob.scale)};
  animation: ${anim.auroraDrift} ${({ $blob }) => `${String($blob.durationS)}s`} ease-in-out infinite alternate;
`

export const Veil = styled.div`
  position: absolute;
  inset: 0;
  background: ${colors.veil};
`
