'use client'

import styled, { css } from 'styled-components'

import { CONTAINER_MAX_WIDTH } from '@/constants/layout'
import { Link } from '@/i18n/navigation'
import { focusRing, glass } from '@/styles/mixins'

export const Root = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.header};
  padding: 12px clamp(12px, 3vw, 28px);
`

export const Bar = styled.div`
  ${glass('strong')};
  position: relative;
  overflow: hidden;
  max-width: ${CONTAINER_MAX_WIDTH}px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 10px 18px;
  padding: 9px 10px 9px 14px;
  border-radius: ${({ theme }) => theme.radii.lg}px;
`

export const HomeLink = styled(Link)`
  ${focusRing};
  display: flex;
  border-radius: ${({ theme }) => theme.radii.sm}px;
  transition: opacity 0.25s;

  &:hover {
    opacity: 0.85;
  }
`

export const Nav = styled.nav`
  display: none;
  flex: 1;
  justify-content: center;
  gap: 2px;

  ${({ theme }) => theme.media.desktop} {
    display: flex;
  }
`

export const NavLink = styled(Link)<{ $active: boolean }>`
  ${focusRing};
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.radii.base}px;
  font-size: 14.5px;
  font-weight: 500;
  transition:
    background 0.25s,
    color 0.25s;

  ${({ theme, $active }) =>
    $active
      ? css`
          background: ${theme.colors.muted};
          color: ${theme.colors.accent};
        `
      : css`
          color: ${theme.colors.ink};
          &:hover {
            background: ${theme.colors.muted};
            color: ${theme.colors.accent};
          }
        `}
`

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;

  ${({ theme }) => theme.media.desktop} {
    margin-left: 0;
  }
`

/** CTA u headeru ne staje na telefon — tamo je u meniju. */
export const OnTablet = styled.span`
  display: none;

  ${({ theme }) => theme.media.tablet} {
    display: inline-flex;
  }
`

/** Dugme menija samo ispod desktop širine. */
export const BelowDesktop = styled.span`
  display: inline-flex;

  ${({ theme }) => theme.media.desktop} {
    display: none;
  }
`
