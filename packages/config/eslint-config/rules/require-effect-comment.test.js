import { RuleTester } from 'eslint';
import { describe, it } from 'vitest';
import { requireEffectComment } from './require-effect-comment.js';

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
});

describe('require-effect-comment', () => {
  it('prolazi RuleTester', () => {
    ruleTester.run('require-effect-comment', requireEffectComment, {
      valid: [
        {
          code: `
            // effect: mousemove na window
            useEffect(() => {}, []);
          `,
        },
        // Veliko slovo i razmaci su dozvoljeni
        {
          code: `
            //  Effect:  WebSocket lifecycle
            useEffect(() => {}, []);
          `,
        },
        // Blok komentar
        {
          code: `
            /* effect: scroll restore na promenu rute */
            useEffect(() => {}, [pathname]);
          `,
        },
        // useLayoutEffect je pokriven istim pravilom
        {
          code: `
            // effect: merenje DOM čvora pre paint-a
            useLayoutEffect(() => {}, []);
          `,
        },
        // React.useEffect
        {
          code: `
            // effect: analytics page-view
            React.useEffect(() => {}, []);
          `,
        },
        // Unutar komponente
        {
          code: `
            function Card() {
              // effect: IntersectionObserver
              useEffect(() => {}, []);
              return null;
            }
          `,
        },
        // Drugi hookovi se ne diraju
        { code: 'useMemo(() => 1, []);' },
        { code: 'useCallback(() => {}, []);' },
        // Hook izvan liste kad je opcija suzena
        {
          code: 'useLayoutEffect(() => {}, []);',
          options: [{ hooks: ['useEffect'] }],
        },
      ],

      invalid: [
        {
          code: 'useEffect(() => {}, []);',
          errors: [{ messageId: 'missing', data: { hook: 'useEffect' } }],
        },
        // Komentar koji nije "effect:"
        {
          code: `
            // ovo sluša event
            useEffect(() => {}, []);
          `,
          errors: [{ messageId: 'missing' }],
        },
        // Prazan "effect:" — bez imenovanog sistema
        {
          code: `
            // effect:
            useEffect(() => {}, []);
          `,
          errors: [{ messageId: 'empty', data: { hook: 'useEffect' } }],
        },
        {
          code: `
            //   effect:
            useLayoutEffect(() => {}, []);
          `,
          errors: [{ messageId: 'empty', data: { hook: 'useLayoutEffect' } }],
        },
        // Unutar komponente, bez komentara
        {
          code: `
            function Card() {
              useEffect(() => {}, []);
              return null;
            }
          `,
          errors: [{ messageId: 'missing' }],
        },
        // Dva useEffect-a, samo drugi ima komentar
        {
          code: `
            function Card() {
              useEffect(() => {}, []);
              // effect: resize na window
              useEffect(() => {}, []);
            }
          `,
          errors: [{ messageId: 'missing' }],
        },
      ],
    });
  });
});
