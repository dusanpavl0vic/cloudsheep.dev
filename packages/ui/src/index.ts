// Javni API dizajn sistema (docs/adr/0005 — barrel samo na granici paketa).
//
// Komponente ovde ne znaju za domen, store ni i18n ključeve — sve primaju kroz props.
// Test: rade li u projektu bez Redux-a i bez i18n-a? (packages/ui/CLAUDE.md)

// ── ui/ — shadcn primitivi, flat po ADR 0007 ──
export { Accordion } from './ui/accordion'
export { Badge } from './ui/badge'
export { Button } from './ui/button'
export { Card, CardContent, CardHeader, CardTitle } from './ui/card'
export { Container } from './ui/container'
export { Input } from './ui/input'
export { Label } from './ui/label'
export { Textarea } from './ui/textarea'

// Varijante su javne — app ih koristi za kompoziciju bez dupliranja stila
export { accordionItemVariants } from './ui/accordion.variants'
export { badgeMarkerVariants, badgeVariants } from './ui/badge.variants'
export { buttonVariants } from './ui/button.variants'
export { containerVariants } from './ui/container.variants'

// ── atoms ──
export { Eyebrow } from './atoms/Eyebrow'
export { Reveal } from './atoms/Reveal'
export { StatItem } from './atoms/StatItem'
export { TextLink } from './atoms/TextLink'

// ── molecules ──
export { PageHeader } from './molecules/PageHeader'
export { TagList, type TagListItem } from './molecules/TagList'

// ── layouts ──
export { SectionBlock } from './layouts/SectionBlock'

// ── lib ──
export { cn } from './lib/cn'
export { dottedSurfaceVariants, surfaceVariants } from './lib/surface.variants'
