/**
 * Zabranjuje hex i rgb(a) boje u `.styles.ts` — boje dolaze iz teme (`theme.colors.x`) ili
 * iz konstanti tokena (`BRAND_COLORS`, `GLOW`). Šablon §4.1: „Hex i px vrednosti tokena se
 * ne pišu direktno". Pravilo bez provere biće prekršeno (docs/16-tooling-ci.md §2).
 */
const RAW_COLOR = /#[0-9a-fA-F]{3,8}\b|\brgba?\(/

export const noRawColors = {
  meta: {
    type: 'problem',
    docs: { description: 'Bez hex/rgb boja u stilovima — samo tokeni teme' },
    messages: {
      raw: 'Sirova boja „{{ value }}" u stilu. Koristi theme.colors.* ili token iz @/constants/theme (docs/08-styling-ui.md §2).',
    },
    schema: [],
  },
  create(context) {
    const check = (node, text) => {
      const match = RAW_COLOR.exec(text)
      if (match) context.report({ node, messageId: 'raw', data: { value: match[0] } })
    }
    return {
      TemplateElement(node) {
        check(node, node.value.raw)
      },
      Literal(node) {
        if (typeof node.value === 'string') check(node, node.value)
      },
    }
  },
}
