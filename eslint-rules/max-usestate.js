/**
 * @app/max-usestate
 *
 * Prijavljuje komponentu sa više od N `useState` poziva (podrazumevano 2).
 *
 * Pravilo je HEURISTIKA, ne zakon — vidi docs/07-performance.md §4. Kao pritisak ka boljem
 * dizajnu je korisno; kao dogma vodi u veštačke `useReducer`-e nad tri booleana. Zato poruka
 * nabraja eskalacionu listu umesto da samo kaže "previše".
 *
 * Broji se po komponenti (PascalCase funkcija), ne po fajlu — fajl sme da ima tri komponente
 * sa po dva `useState`-a.
 */

/** @type {import('eslint').Rule.RuleModule} */
export const maxUseState = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Ograničava broj useState poziva po komponenti',
      url: 'https://github.com/dusanpavl0vic/cloudsheep.dev/blob/dev/docs/07-performance.md',
    },
    schema: [
      {
        type: 'object',
        properties: { max: { type: 'integer', minimum: 0 } },
        additionalProperties: false,
      },
    ],
    messages: {
      tooMany:
        'Komponenta "{{name}}" ima {{count}} useState poziva (limit {{max}}). ' +
        'Prođi eskalacionu listu iz docs/07-performance.md §4: ' +
        '1) derivirano → izbriši, izračunaj tokom rendera; 2) povezana polja → useReducer; ' +
        '3) forma → react-hook-form; 4) prelazi granicu komponente → Redux preko feature hooka; ' +
        '5) pripada URL-u → useSearchParams. ' +
        'Ako ništa ne pomaže, komponenta radi previše stvari — podeli je.',
    },
  },

  create(context) {
    const max = context.options[0]?.max ?? 2

    /** Stek funkcija: { name, isComponent, count, node } */
    const stack = []

    const isPascalCase = (name) => typeof name === 'string' && /^[A-Z]/.test(name)

    function functionName(node) {
      if (node.id?.name) return node.id.name
      const parent = node.parent
      if (parent?.type === 'VariableDeclarator' && parent.id?.type === 'Identifier') {
        return parent.id.name
      }
      if (parent?.type === 'Property' && parent.key?.type === 'Identifier') {
        return parent.key.name
      }
      return null
    }

    function enterFunction(node) {
      const name = functionName(node)
      stack.push({ name, isComponent: isPascalCase(name), count: 0, node })
    }

    function exitFunction() {
      const frame = stack.pop()
      if (!frame || !frame.isComponent || frame.count <= max) return

      context.report({
        node: frame.node,
        messageId: 'tooMany',
        data: { name: frame.name, count: String(frame.count), max: String(max) },
      })
    }

    return {
      FunctionDeclaration: enterFunction,
      FunctionExpression: enterFunction,
      ArrowFunctionExpression: enterFunction,
      'FunctionDeclaration:exit': exitFunction,
      'FunctionExpression:exit': exitFunction,
      'ArrowFunctionExpression:exit': exitFunction,

      CallExpression(node) {
        const callee = node.callee
        const isUseState =
          (callee.type === 'Identifier' && callee.name === 'useState') ||
          (callee.type === 'MemberExpression' &&
            callee.object.type === 'Identifier' &&
            callee.object.name === 'React' &&
            callee.property.type === 'Identifier' &&
            callee.property.name === 'useState')

        if (!isUseState) return

        // Pripiši najbližoj komponenti u steku — useState unutar ugnježdenog
        // callback-a i dalje pripada komponenti koja ga renderuje.
        for (let i = stack.length - 1; i >= 0; i -= 1) {
          if (stack[i].isComponent) {
            stack[i].count += 1
            return
          }
        }
      },
    }
  },
}
