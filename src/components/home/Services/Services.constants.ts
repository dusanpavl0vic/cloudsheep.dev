/**
 * Četiri discipline (dizajn `CS2.disciplines`). Naslov i opis su u `home.services.items.<key>`;
 * oznake su stručni termini koje dizajn ne prevodi ni na srpskom.
 */
export const SERVICES = [
  { key: 'design', number: '01', slug: '/ design', icon: '/tech/figma.svg', tags: ['ux/ui', 'design systems', 'prototyping'] },
  { key: 'web', number: '02', slug: '/ web', icon: '/tech/nextjs.svg', tags: ['next.js', 'typescript', 'postgresql'] },
  { key: 'mobile', number: '03', slug: '/ mobile', icon: '/tech/reactnative.svg', tags: ['react native', 'kotlin', 'swift'] },
  { key: 'ops', number: '04', slug: '/ ops', icon: '/tech/docker.svg', tags: ['node.js', 'docker', 'ci/cd'] },
] as const
