export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { categorizeTransaction } from '@/lib/categorize'

const Schema = z.object({ description: z.string().min(1) })

export async function POST(req: NextRequest) {
  const body = await req.json()
  const parsed = Schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'description obrigatória' }, { status: 400 })

  const category = await categorizeTransaction(parsed.data.description)
  return NextResponse.json({ category })
}
