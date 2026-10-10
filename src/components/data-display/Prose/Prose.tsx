import { Root } from './Prose.styles'

interface ProseProps {
  /** HTML iz `renderMarkdown` — sirov HTML iz izvora je već ekraniran. */
  html: string
  className?: string
}

/** Tipografija dugog teksta (beleška, pregled u admin-u). */
const Prose = ({ html, className }: ProseProps) => <Root className={className} dangerouslySetInnerHTML={{ __html: html }} />

export default Prose
