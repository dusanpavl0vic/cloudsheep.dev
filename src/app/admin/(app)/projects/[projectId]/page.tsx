import ProjectEditor from '@/components/admin/projects/ProjectEditor'

interface ProjectPageProps {
  params: Promise<{ projectId: string }>
}

/** `/admin/projects/[projectId]` */
const ProjectPage = async ({ params }: ProjectPageProps) => <ProjectEditor projectId={(await params).projectId} />

export default ProjectPage
