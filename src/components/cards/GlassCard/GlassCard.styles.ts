import { css, styled } from 'next-yak'

import Slot from '@/components/foundations/Slot'
import { EASE_OUT, blur, colors, fonts, media, radii } from '@/styles/tokens.yak'
import { ACCENTS } from '@/styles/tokens.yak'

export const Root = styled(Slot)<{ $interactive: boolean }>`
  position: relative;
  isolation: isolate;
  overflow: hidden;
  padding: 24px 22px;
  border-radius: ${radii.xl}px;
  background: ${colors.glass};
  backdrop-filter: ${blur.soft};
  -webkit-backdrop-filter: ${blur.soft};
  border: 1px solid ${colors.edge};
  box-shadow:
    inset 0 1px 0 0 ${colors.spec},
    ${ACCENTS.cardShadow};
  transition:
    border-color 0.5s,
    box-shadow 0.5s,
    translate 0.5s ${EASE_OUT};

  ${media.tablet} {
    padding: 30px;
  }

  ${({ $interactive }) =>
    $interactive &&
    css`
      ${media.hover} {
        &:hover {
          border-color: ${ACCENTS.hoverEdge};
          translate: 0 -4px;
          box-shadow:
            inset 0 1px 0 0 ${colors.spec},
            ${ACCENTS.cardShadowHover};
        }
      }
    `}
`

/** Sjaj koji prati kursor — `PageEffects` postavlja `--gx`/`--gy` na `data-glow` element. */
export const Glow = styled.span`
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  background-image: radial-gradient(
    circle 260px at var(--gx, -400px) var(--gy, -400px),
    ${ACCENTS.cardGlow} 0%,
    transparent 72%
  );
`

export const TopLine = styled.span`
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, ${ACCENTS.topLine}, transparent);
`

export const Number = styled.span`
  position: absolute;
  top: 14px;
  right: 22px;
  z-index: -1;
  font-family: ${fonts.heading};
  font-weight: 700;
  font-size: 64px;
  line-height: 1;
  color: ${colors.ink};
  opacity: 0.06;

  ${media.tablet} {
    font-size: 78px;
  }
`

export const Corner = styled.span<{ $side: 'left' | 'right' }>`
  position: absolute;
  bottom: 16px;
  ${({ $side }) => $side}: 16px;
  width: 12px;
  height: 12px;
  border-bottom: 1px solid ${colors.line2};
  border-${({ $side }) => $side}: 1px solid ${colors.line2};
`
