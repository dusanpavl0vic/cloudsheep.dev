import CvEditor from '@/components/admin/cv/CvEditor'

interface CvPageProps {
  params: Promise<{ memberId: string }>
}

/** `/admin/team/[memberId]/cv` */
const CvPage = async ({ params }: CvPageProps) => <CvEditor memberId={(await params).memberId} />

export default CvPage
