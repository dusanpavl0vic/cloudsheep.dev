/**
 * @app/require-effect-comment
 *
 * Traži komentar `// effect: <koji spoljni sistem sinhronizuje>` neposredno iznad `useEffect`-a.
 *
 * Ovo NIJE industrijska praksa — vidi docs/07-performance.md §3. To je naše pravilo, napisano
 * da bi zahtev "useEffect samo za spoljne sisteme" bio mašinski proverljiv umesto da ostane
 * na dobroj volji. Komentar tera autora da imenuje spoljni sistem; ako ne može da ga imenuje,
 * verovatno mu useEffect ne treba.
 *
 * Ako pravilo počne da smeta timu — obriši ga. Whitelist iz docs/07 §3 ostaje i bez njega.
 */

/** @type {import('eslint').Rule.RuleModule} */
export const requireEffectComment = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Traži // effect: komentar iznad svakog useEffect-a',
      url: 'https://github.com/dusanpavl0vic/cloudsheep.dev/blob/dev/docs/07-performance.md',
    },
    schema: [
      {
        type: 'object',
        properties: {
          // Podrazumevano pokriva i useLayoutEffect — isti zahtev, isti razlog.
          hooks: { type: 'array', items: { type: 'string' } },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      missing:
        '{{hook}} bez "// effect:" komentara. Dodaj komentar koji imenuje spoljni sistem ' +
        'koji se sinhronizuje, npr. "// effect: mousemove na window". ' +
        'Ako ne možeš da imenuješ spoljni sistem, useEffect ti verovatno ne treba — ' +
        'vidi tabelu zamena u docs/07-performance.md §3.',
      empty:
        '{{hook}} ima "// effect:" komentar bez objašnjenja. Imenuj spoljni sistem, ' +
        'ne piši samo "// effect:".',
    },
  },

  create(context) {
    const hooks = context.options[0]?.hooks ?? ['useEffect', 'useLayoutEffect']
    const source = context.sourceCode ?? context.getSourceCode()

    const EFFECT_PREFIX = /^\s*effect\s*:/i

    return {
      CallExpression(node) {
        const callee = node.callee
        const name =
          callee.type === 'Identifier'
            ? callee.name
            : callee.type === 'MemberExpression' && callee.property.type === 'Identifier'
              ? callee.property.name
              : null

        if (!name || !hooks.includes(name)) return

        // Popni se do naredbe koja sadrži poziv — komentar stoji iznad nje,
        // ne iznad same CallExpression (npr. `const x = useEffect(...)` nije slučaj,
        // ali `useEffect(...)` unutar ExpressionStatement jeste).
        let statement = node
        while (
          statement.parent &&
          !/Statement|Declaration/.test(statement.parent.type) &&
          statement.parent.type !== 'Program'
        ) {
          statement = statement.parent
        }
        const target = statement.parent?.type === 'Program' ? statement : statement.parent

        const comments = source.getCommentsBefore(target)
        const effectComment = comments.find((c) => EFFECT_PREFIX.test(c.value))

        if (!effectComment) {
          context.report({ node, messageId: 'missing', data: { hook: name } })
          return
        }

        const explanation = effectComment.value.replace(EFFECT_PREFIX, '').trim()
        if (explanation.length === 0) {
          context.report({ node, messageId: 'empty', data: { hook: name } })
        }
      },
    }
  },
}
