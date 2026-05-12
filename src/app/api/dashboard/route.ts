import { NextResponse } from 'next/server'
import { getDashboardData } from '@/lib/dashboard'

export const revalidate = 60

export async function GET() {
  try {
    const data = await getDashboardData()
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

