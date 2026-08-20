// Javni API feature-a: SAMO hookovi, tipovi i komponente.
// Slice, selektori i endpointi ostaju unutra — oni su implementacija (docs/01 §4).
export { ProjectForm } from './components/ProjectForm'
export { ProjectsTable } from './components/ProjectsTable'
export { useDeleteProject } from './hooks/useDeleteProject'
export { useProjectForm } from './hooks/useProjectForm'
export { useProjectOrder } from './hooks/useProjectOrder'
export { useProjects } from './hooks/useProjects'
export { PROJECT_CATEGORIES, type AdminProject, type ProjectCategory } from './types'
