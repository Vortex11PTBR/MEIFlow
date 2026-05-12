export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { categorizeTransaction } from '@/lib/categorize'
import { DEMO_TENANT_CNPJ } from '@/lib/utils'
import { TransactionType } from '@prisma/client'
import { revalidateTag } from 'next/cache'

const CreateSchema = z.object({
  description: z.string().min(1).max(255),
  amount: z.number().positive(),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().optional(),
  date: z.string().optional(),
  clientId: z.string().optional(),
  notes: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const page = Number(searchParams.get('page') ?? '1')
  const limit = Math.min(Number(searchParams.get('limit') ?? '20'), 50)

  const tenant = await prisma.tenant.findUnique({ where: { cnpj: DEMO_TENANT_CNPJ } })
  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })

  const [total, transactions] = await Promise.all([
    prisma.transaction.count({ where: { tenantId: tenant.id } }),
    prisma.transaction.findMany({
      where: { tenantId: tenant.id },
      orderBy: { date: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: { client: { select: { name: true } } },
    }),
  ])

  return NextResponse.json({ transactions, total, page, limit })
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = CreateSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { description, amount, type, date, clientId, category: userCategory, notes } = parsed.data
  const tenant = await prisma.tenant.findUnique({ where: { cnpj: DEMO_TENANT_CNPJ } })
  if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })

  const category = userCategory ?? (await categorizeTransaction(description))

  const tx = await prisma.transaction.create({
    data: {
      tenantId: tenant.id,
      description,
      amount,
      type: type as TransactionType,
      category,
      date: date ? new Date(date) : new Date(),
      clientId: clientId ?? null,
      notes: notes ?? null,
      aiCategorized: true,
    },
  })

  revalidateTag('dashboard')
  return NextResponse.json(tx, { status: 201 })
}

