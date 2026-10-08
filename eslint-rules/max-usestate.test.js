import { RuleTester } from 'eslint'
import { describe, it } from 'vitest'

import { maxUseState } from './max-usestate.js'

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
})

describe('max-usestate', () => {
  it('prolazi RuleTester', () => {
    ruleTester.run('max-usestate', maxUseState, {
      valid: [
        // Ispod limita
        { code: 'function Card() { const [a, setA] = useState(0); return null; }' },
        {
          code: 'function Card() { const [a] = useState(0); const [b] = useState(1); return null; }',
        },

        // Ne-komponenta (camelCase) se ne broji — hook sme više stanja
        {
          code: 'function useThing() { const [a] = useState(); const [b] = useState(); const [c] = useState(); }',
        },

        // Tri komponente sa po dva useState-a u istom fajlu
        {
          code: `
            function A() { const [a] = useState(); const [b] = useState(); return null; }
            function B() { const [a] = useState(); const [b] = useState(); return null; }
          `,
        },

        // Podignut limit kroz opciju
        {
          code: 'function Card() { const [a] = useState(); const [b] = useState(); const [c] = useState(); }',
          options: [{ max: 3 }],
        },

        // Nije useState
        {
          code: 'function Card() { const a = useMemo(); const b = useRef(); const c = useContext(); }',
        },

        // Arrow komponenta ispod limita
        { code: 'const Card = () => { const [a] = useState(); return null; };' },
      ],

      invalid: [
        {
          code: 'function Card() { const [a] = useState(); const [b] = useState(); const [c] = useState(); return null; }',
          errors: [{ messageId: 'tooMany', data: { name: 'Card', count: '3', max: '2' } }],
        },

        // Arrow funkcija dodeljena PascalCase promenljivoj
        {
          code: 'const Panel = () => { const [a] = useState(); const [b] = useState(); const [c] = useState(); };',
          errors: [{ messageId: 'tooMany' }],
        },

        // React.useState se takođe broji
        {
          code: 'function Card() { React.useState(); React.useState(); React.useState(); }',
          errors: [{ messageId: 'tooMany' }],
        },

        // useState unutar ugnježdenog callback-a i dalje pripada komponenti
        {
          code: `
            function Card() {
              const [a] = useState();
              const [b] = useState();
              const render = () => { const [c] = useState(); };
              return null;
            }
          `,
          errors: [{ messageId: 'tooMany' }],
        },

        // Samo prekoračena komponenta se prijavljuje, ne obe
        {
          code: `
            function Ok() { const [a] = useState(); return null; }
            function Bad() { const [a] = useState(); const [b] = useState(); const [c] = useState(); return null; }
          `,
          errors: [{ messageId: 'tooMany', data: { name: 'Bad', count: '3', max: '2' } }],
        },

        // Snižen limit
        {
          code: 'function Card() { const [a] = useState(); const [b] = useState(); }',
          options: [{ max: 1 }],
          errors: [{ messageId: 'tooMany' }],
        },
      ],
    })
  })
})
