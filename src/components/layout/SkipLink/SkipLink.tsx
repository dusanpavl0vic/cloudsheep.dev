import { Root } from './SkipLink.styles'

/** Prvi fokus na stranici: preskače header (docs/15-accessibility.md §2). */
const SkipLink = ({ label, target = 'main' }: { label: string; target?: string }) => <Root href={`#${target}`}>{label}</Root>

export default SkipLink
