import 'server-only'

import { Marked } from 'marked'

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/**
 * Markdown beleške → HTML, na serveru (nula JS-a na klijentu za čitanje beleške).
 *
 * Sirov HTML iz izvora se EKRANIRA, ne propušta: belešku piše admin, ali HTML koji se
 * ubacuje u stranicu kroz `dangerouslySetInnerHTML` mora biti bezbedan bez obzira na to ko ga
 * je napisao. Spoljni linkovi dobijaju `rel="noopener noreferrer"`.
 */
const marked = new Marked({
  gfm: true,
  breaks: false,
  renderer: {
    html({ text }) {
      return escapeHtml(text)
    },
    link({ href, title, tokens }) {
      // Tekst linka ide kroz parser (ekranira ga i čuva `**bold**` unutar linka).
      const inner = this.parser.parseInline(tokens)
      const external = /^https?:\/\//.test(href)
      // `javascript:` i slične sheme nikad ne postaju link
      const safeHref = /^(https?:|mailto:|\/|#)/.test(href) ? href : '#'
      return `<a href="${escapeHtml(safeHref)}"${title ? ` title="${escapeHtml(title)}"` : ''}${
        external ? ' target="_blank" rel="noopener noreferrer"' : ''
      }>${inner}</a>`
    },
  },
})

export const renderMarkdown = (source: string) => marked.parse(source, { async: false })

/** Broj reči za „N min čitanja". */
export const countWords = (source: string) => source.split(/\s+/).filter(Boolean).length
