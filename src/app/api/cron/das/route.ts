export const dynamic = 'force-dynamic'

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Resend } from 'resend'
import { calcDASCountdown } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ error: 'RESEND_API_KEY not configured' }, { status: 503 })
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const daysLeft = calcDASCountdown()
  if (daysLeft > 5) {
    return NextResponse.json({ message: `DAS vence em ${daysLeft} dias — sem notificação.` })
  }

  const tenants = await prisma.tenant.findMany({
    where: { isDemo: false },
    select: { email: true, razaoSocial: true, nomeFantasia: true },
  })

  const sent: string[] = []
  for (const t of tenants) {
    const name = t.nomeFantasia ?? t.razaoSocial
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? 'MEIFlow <noreply@meiflow.app>',
      to: t.email,
      subject: `⚡ DAS vence em ${daysLeft} dia${daysLeft !== 1 ? 's' : ''} — não deixe multar!`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#00d4ff">MEIFlow · Alerta de DAS</h2>
          <p>Olá, <strong>${name}</strong>!</p>
          <p>Seu DAS vence em <strong>${daysLeft} dia${daysLeft !== 1 ? 's' : ''}</strong>. Pague para evitar multa de 2% + juros Selic.</p>
          <p>
            <a href="https://www8.receita.fazenda.gov.br/SimplesNacional/Aplicacoes/ATSPO/pgmei.app/Identificacao"
               style="background:#00d4ff;color:#05070f;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:bold;display:inline-block">
              Gerar DAS no Portal PGMEI →
            </a>
          </p>
          <p style="color:#64748b;font-size:12px">MEIFlow · gestão financeira para MEIs</p>
        </div>
      `,
    })
    sent.push(t.email)
  }

  return NextResponse.json({ sent: sent.length, emails: sent })
}
