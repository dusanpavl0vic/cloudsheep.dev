import { styled } from 'next-yak'

import { BRAND_COLORS, CONTAINER_MAX_WIDTH, INVERSE, colors, fonts, radii } from '@/styles/tokens.yak'

export const Article = styled.article`
  max-width: ${CONTAINER_MAX_WIDTH}px;
  margin: 0 auto;
  padding: clamp(48px, 7vw, 90px) 20px 60px;
  display: flex;
  flex-direction: column;
  gap: 28px;
`

/** Čitljiva kolona: ~70 znakova u redu. */
export const Column = styled.div`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
`

export const Meta = styled.p`
  display: flex;
  flex-wrap: wrap;
  gap: 6px 14px;
  font-family: ${fonts.mono};
  font-size: 13px;
  color: ${colors.faint};
`

export const Tag = styled.span`
  color: ${colors.accent};
`

export const Title = styled.h1`
  font-size: clamp(2.4rem, 6vw, 4.4rem);
  line-height: 1;
  letter-spacing: -0.045em;
  color: ${colors.display};
  text-wrap: balance;
`

export const Lead = styled.p`
  font-size: clamp(1.1rem, 1.8vw, 1.3rem);
  line-height: 1.55;
  color: ${colors.ink2};
`

/** Telo beleške — HTML iz markdown-a (server). Liste vraćaju markere koje reset uklanja. */
export const Prose = styled.div`
  font-size: 18px;
  line-height: 1.75;
  color: ${colors.ink};

  & > * + * {
    margin-top: 1.1em;
  }

  h2,
  h3 {
    margin-top: 1.8em;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  h2 {
    font-size: 1.7em;
  }

  h3 {
    font-size: 1.3em;
  }

  a {
    color: ${colors.accent};
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  ul,
  ol {
    padding-left: 1.3em;
  }

  ul {
    list-style: disc;
  }

  ol {
    list-style: decimal;
  }

  li + li {
    margin-top: 0.4em;
  }

  blockquote {
    padding: 4px 0 4px 20px;
    border-left: 3px solid ${BRAND_COLORS.blue};
    color: ${colors.ink2};
    font-style: italic;
  }

  code {
    padding: 2px 6px;
    border-radius: 6px;
    background: ${colors.muted};
    font-family: ${fonts.mono};
    font-size: 0.85em;
  }

  pre {
    padding: 18px 20px;
    border-radius: ${radii.lg}px;
    background: ${INVERSE.surface};
    color: ${INVERSE.soft};
    overflow-x: auto;
    font-size: 15px;
    line-height: 1.6;
  }

  pre code {
    padding: 0;
    background: none;
    color: inherit;
  }

  img {
    border-radius: ${radii.lg}px;
  }

  hr {
    border: 0;
    height: 1px;
    background: ${colors.line};
  }
`

export const More = styled.section`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  gap: 22px;

  h2 {
    font-size: clamp(1.6rem, 3vw, 2.2rem);
    letter-spacing: -0.03em;
    color: ${colors.display};
  }
`

export const MoreGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 280px), 1fr));
  gap: 22px;
`
