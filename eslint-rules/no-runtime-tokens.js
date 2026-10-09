/**
 * U `.styles.ts` funkcija u šablonu (`${({ $x }) => …}`) se izvršava u runtime-u. Ako čita
 * vrednost iz `.yak` fajla (`colors.accent`, `BUTTON_SIZES.l`), ceo `constants/theme` ulazi u
 * klijentski JS (ADR 0015). Funkcija sme samo da IZABERE statičan `css\`…\`` blok — tokeni
 * unutar njega se izvlače u CSS u build-u.
 */
const isYakSource = (source) => /\.yak$/.test(source)

const isInterpolatedFunction = (node) =>
  (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') && node.parent?.type === 'TemplateLiteral'

const isCssTag = (node) => node.type === 'TaggedTemplateExpression' && node.tag.type === 'Identifier' && node.tag.name === 'css'

export const noRuntimeTokens = {
  meta: {
    type: 'problem',
    docs: { description: 'Token iz .yak fajla se ne čita u runtime funkciji stila' },
    messages: {
      runtime:
        '„{{ name }}" se čita u runtime-u — funkcija u stilu neka bira statičan css`…` blok (docs/08-styling-ui.md §2, ADR 0015).',
    },
    schema: [],
  },
  create(context) {
    const yakNames = new Set()

    return {
      ImportDeclaration(node) {
        if (!isYakSource(node.source.value)) return
        for (const specifier of node.specifiers) yakNames.add(specifier.local.name)
      },
      Identifier(node) {
        if (!yakNames.has(node.name)) return
        if (node.parent.type === 'ImportSpecifier' || (node.parent.type === 'MemberExpression' && node.parent.property === node && !node.parent.computed)) return

        const ancestors = context.sourceCode.getAncestors(node)
        for (let i = ancestors.length - 1; i >= 0; i--) {
          const ancestor = ancestors[i]
          if (isCssTag(ancestor)) return
          if (isInterpolatedFunction(ancestor)) {
            context.report({ node, messageId: 'runtime', data: { name: node.name } })
            return
          }
        }
      },
    }
  },
}
