import NoteEditor from '@/components/admin/notes/NoteEditor'

interface NotePageProps {
  params: Promise<{ noteId: string }>
}

/** `/admin/notes/[noteId]` */
const NotePage = async ({ params }: NotePageProps) => <NoteEditor noteId={(await params).noteId} />

export default NotePage
