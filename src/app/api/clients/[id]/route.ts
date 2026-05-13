import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const client = await prisma.client.findUnique({
    where: { id: params.id },
    select: { tenantId: true },
  })

  if (!client || client.tenantId !== session.user.tenantId) {
    return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
  }

  await prisma.client.delete({ where: { id: params.id } })

  return NextResponse.json({ ok: true })
}
