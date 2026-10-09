import { css, styled } from 'next-yak'

import Slot from '@/components/foundations/Slot'
import { focusRing, glassStrong } from '@/styles/mixins'
import { colors, fonts, media } from '@/styles/tokens.yak'

export const Root = styled.div`
  min-height: 100vh;
  display: grid;
  /* minmax(0, …): meni koji klizi horizontalno ne sme da raširi kolonu (i stranicu) na telefonu. */
  grid-template-columns: minmax(0, 1fr);

  ${media.desktop} {
    grid-template-columns: 248px minmax(0, 1fr);
  }
`

export const Sidebar = styled.aside`
  ${glassStrong};
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: 18px 14px;
  border-radius: 0;
  border-width: 0 0 1px;

  ${media.desktop} {
    position: sticky;
    top: 0;
    height: 100vh;
    border-width: 0 1px 0 0;
    padding: 24px 16px;
  }
`

export const Brand = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 0 6px;
`

/** Na telefonu meni klizi horizontalno; od desktopa je kolona. */
export const NavList = styled.ul`
  display: flex;
  gap: 4px;
  overflow-x: auto;

  ${media.desktop} {
    flex-direction: column;
    overflow: visible;
  }
`

export const NavLink = styled(Slot)<{ $active: boolean }>`
  ${focusRing};
  display: block;
  padding: 9px 12px;
  border-radius: 10px;
  color: ${colors.ink};
  font-size: 15px;
  font-weight: 500;
  white-space: nowrap;

  &:hover {
    background: ${colors.muted};
  }

  ${({ $active }) =>
    $active &&
    css`
      background: ${colors.muted};
      color: ${colors.accent};
      font-weight: 700;
    `}
`

export const Footer = styled.div`
  display: none;
  flex-direction: column;
  gap: 12px;
  margin-top: auto;
  padding: 0 6px;

  ${media.desktop} {
    display: flex;
  }
`

export const User = styled.p`
  font-family: ${fonts.mono};
  font-size: 12px;
  color: ${colors.faint};
  overflow-wrap: anywhere;
`

export const Main = styled.main`
  min-width: 0;
  padding: clamp(20px, 3vw, 40px);
`

export const MobileBar = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;

  ${media.desktop} {
    display: none;
  }
`

export const Centered = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  color: ${colors.faint};
`
