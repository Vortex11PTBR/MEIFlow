import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { ClientesContent } from '@/components/ClientesContent'

export const revalidate = 60

export default async function ClientesPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.tenantId) redirect('/onboarding')

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
    include: { clients: { orderBy: { name: 'asc' } } },
  })

  if (!tenant) redirect('/onboarding')

  return <ClientesContent clients={tenant.clients ?? []} />
}