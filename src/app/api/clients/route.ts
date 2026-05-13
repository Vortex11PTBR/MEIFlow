import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

const CreateClientSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').max(200),
  email: z.string().email('E-mail inválido').optional().or(z.literal('')),
  phone: z.string().max(20).optional().or(z.literal('')),
  cnpj: z.string().max(20).optional().or(z.literal('')),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = CreateClientSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { name, email, phone, cnpj } = parsed.data

  const client = await prisma.client.create({
    data: {
      tenantId: session.user.tenantId,
      name,
      email: email || null,
      phone: phone || null,
      cnpj: cnpj || null,
    },
  })

  return NextResponse.json(client, { status: 201 })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.tenantId) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const clients = await prisma.client.findMany({
    where: { tenantId: session.user.tenantId },
    orderBy: { name: 'asc' },
  })

  return NextResponse.json(clients)
}
