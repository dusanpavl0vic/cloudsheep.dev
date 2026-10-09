import { styled } from 'next-yak'

import { Link } from '@/i18n/navigation'
import { glassStrong } from '@/styles/mixins'
import { EASE_OUT, colors, fonts, media } from '@/styles/tokens.yak'

export const Root = styled.article`
  ${glassStrong};
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 12px 12px 22px;
  border-radius: 22px;
  transition: transform 0.45s ${EASE_OUT};

  ${media.hover} {
    &:hover {
      transform: translateY(-6px);
    }
  }

  &:focus-within {
    outline: 2px solid ${colors.accent};
    outline-offset: 3px;
  }
`

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 8px;
`

export const Meta = styled.p`
  display: flex;
  justify-content: space-between;
  gap: 10px;
  font-family: ${fonts.mono};
  font-size: 12px;
  color: ${colors.faint};
`

export const Tag = styled.span`
  color: ${colors.accent};
`

export const Title = styled.h2`
  font-size: 22px;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: ${colors.display};
`

/** Link u naslovu pokriva celu karticu — jedan tab stop. */
export const TitleLink = styled(Link)`
  outline: none;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
  }
`

export const Excerpt = styled.p`
  font-size: 15px;
  line-height: 1.55;
  color: ${colors.ink2};
`
