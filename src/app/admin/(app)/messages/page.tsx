import MessagesView from '@/components/admin/messages/MessagesView'

interface MessagesPageProps {
  searchParams: Promise<{ status?: string }>
}

/** `/admin/messages` — filter je u URL-u (`?status=unread`). */
const MessagesPage = async ({ searchParams }: MessagesPageProps) => {
  const { status } = await searchParams
  return <MessagesView status={status === 'unread' ? 'unread' : 'all'} />
}

export default MessagesPage
