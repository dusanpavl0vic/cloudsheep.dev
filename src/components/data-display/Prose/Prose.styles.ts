import { styled } from 'next-yak'

import { BRAND_COLORS, INVERSE, colors, fonts, radii } from '@/styles/tokens.yak'

/** HTML iz markdown-a (beleška na sajtu, pregled u admin-u). Liste vraćaju markere koje reset uklanja. */
export const Root = styled.div`
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
