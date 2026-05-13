export const dynamic = 'force-dynamic'

import { NextResponse } from 'next/server'
import { getDashboardData } from '@/lib/dashboard'
import { DEMO_TENANT_CNPJ } from '@/lib/utils'

export const revalidate = 60

export async function GET() {
  try {
    const data = await getDashboardData(DEMO_TENANT_CNPJ)
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
