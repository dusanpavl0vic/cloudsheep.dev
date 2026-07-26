/** Sadržaj „Uses" stranice kao podaci. Nazivi alata su literali; opisi idu preko i18n. */

export type UsesIcon = 'keyboard' | 'terminal' | 'cog' | 'grid'

export type UsesGroup = {
  id: string
  icon: UsesIcon
  titleKey: string
  items: readonly { name: string; noteKey: string }[]
}

export const USES_GROUPS: readonly UsesGroup[] = [
  {
    id: 'desk',
    icon: 'keyboard',
    titleKey: 'uses.desk.title',
    items: [
      { name: 'MacBook Pro 14″ M3', noteKey: 'uses.desk.item1' },
      { name: 'Dell U2723QE 27″ 4K', noteKey: 'uses.desk.item2' },
      { name: 'Keychron K3', noteKey: 'uses.desk.item3' },
      { name: 'Pixel 8 + iPhone 13', noteKey: 'uses.desk.item4' },
    ],
  },
  {
    id: 'editor',
    icon: 'terminal',
    titleKey: 'uses.editor.title',
    items: [
      { name: 'VS Code', noteKey: 'uses.editor.item1' },
      { name: 'JetBrains Mono', noteKey: 'uses.editor.item2' },
      { name: 'Ghostty + zsh', noteKey: 'uses.editor.item3' },
      { name: 'Lazygit', noteKey: 'uses.editor.item4' },
    ],
  },
  {
    id: 'stack',
    icon: 'cog',
    titleKey: 'uses.stack.title',
    items: [
      { name: 'Next.js + TypeScript', noteKey: 'uses.stack.item1' },
      { name: 'React Native', noteKey: 'uses.stack.item2' },
      { name: 'PostgreSQL + MongoDB', noteKey: 'uses.stack.item3' },
      { name: 'Node.js', noteKey: 'uses.stack.item4' },
    ],
  },
  {
    id: 'tools',
    icon: 'grid',
    titleKey: 'uses.tools.title',
    items: [
      { name: 'Figma', noteKey: 'uses.tools.item1' },
      { name: 'Docker + GitHub Actions', noteKey: 'uses.tools.item2' },
      { name: 'Hetzner + Cloudflare', noteKey: 'uses.tools.item3' },
      { name: 'Plausible', noteKey: 'uses.tools.item4' },
    ],
  },
] as const
