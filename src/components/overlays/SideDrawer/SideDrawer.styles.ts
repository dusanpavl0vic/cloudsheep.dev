import { keyframes, styled } from 'next-yak'

import { colors, media, radii, shadows, spacing } from '@/styles/tokens.yak'

const slideIn = keyframes`
  from { transform: translateX(24px); opacity: 0; }
  to { transform: none; opacity: 1; }
`

/**
 * Telefon: ceo ekran · tablet: panel od 380 px uz desnu ivicu.
 * Podloga je PUNA, ne staklo: `Backdrop` već ima `backdrop-filter`, pa bi zamućenje panela
 * videlo samo veo — kroz panel se čitao tekst stranice ispod stavki menija.
 */
export const Panel = styled.div`
  width: 100vw;
  max-width: 100%;
  height: 100%;
  overflow-y: auto;
  overscroll-behavior: contain;
  display: flex;
  flex-direction: column;
  gap: ${spacing[6]}px;
  padding: ${spacing[4]}px ${spacing[5]}px ${spacing[6]}px;
  background: ${colors.bg};
  box-shadow: ${shadows.glass};
  animation: ${slideIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  ${media.tablet} {
    width: 380px;
    padding: ${spacing[5]}px;
    border-inline-start: 1px solid ${colors.edge};
    border-start-start-radius: ${radii.lg}px;
    border-end-start-radius: ${radii.lg}px;
  }
`

export const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`
