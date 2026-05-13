import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

const Schema = z.object({
  cnpj: z.string().length(14),
  razaoSocial: z.string().min(1),
  nomeFantasia: z.string().nullable().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  const body = await req.json()
  const parsed = Schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
  }

  const { cnpj, razaoSocial, nomeFantasia } = parsed.data
  const existing = await prisma.tenant.findUnique({ where: { cnpj } })

  if (existing) {
    const owner = await prisma.user.findFirst({ where: { tenantId: existing.id } })

    if (owner && owner.id !== session.user.id) {
      return NextResponse.json({ error: 'Este CNPJ já está cadastrado.' }, { status: 409 })
    }

    return NextResponse.json({ ok: true })
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
  }

  const tenant = await prisma.tenant.create({
    data: {
      cnpj,
      razaoSocial,
      nomeFantasia: nomeFantasia ?? null,
      email: user.email,
      isDemo: false,
    },
  })

  await prisma.user.update({
    where: { id: session.user.id },
    data: { tenantId: tenant.id },
  })

  return NextResponse.json({ ok: true })
}
