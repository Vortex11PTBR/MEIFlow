import { NextRequest, NextResponse } from 'next/server'
import { lookupCNPJ } from '@/lib/cnpj'

export const dynamic = 'force-dynamic'

export async function GET(_req: NextRequest, { params }: { params: { cnpj: string } }) {
  try {
    const data = await lookupCNPJ(params.cnpj)
    return NextResponse.json(data)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Erro desconhecido'
    const status = message.includes('inválido') ? 400 : message.includes('não encontrado') ? 404 : 503
    return NextResponse.json({ error: message }, { status })
  }
}
