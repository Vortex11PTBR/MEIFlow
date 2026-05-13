import { Resend } from 'resend'
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

  const [client, tenant] = await Promise.all([
    prisma.client.create({
      data: {
        tenantId: session.user.tenantId,
        name,
        email: email || null,
        phone: phone || null,
        cnpj: cnpj || null,
      },
    }),
    prisma.tenant.findUnique({
      where: { id: session.user.tenantId },
      select: { nomeFantasia: true, razaoSocial: true },
    }),
  ])

  if (email && process.env.RESEND_API_KEY && tenant) {
    const businessName = tenant.nomeFantasia ?? tenant.razaoSocial
    const resend = new Resend(process.env.RESEND_API_KEY)
    await resend.emails.send({
      from: process.env.RESEND_FROM ?? 'MEIFlow <onboarding@resend.dev>',
      to: email,
      subject: `Você foi cadastrado como cliente de ${businessName}`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
          <div style="background:linear-gradient(135deg,#1e3a5f 0%,#1e40af 100%);padding:32px 36px">
            <div style="display:flex;align-items:center;gap:10px">
              <div style="width:32px;height:32px;background:#3b82f6;border-radius:8px;display:flex;align-items:center;justify-content:center">
                <span style="color:white;font-size:16px;font-weight:bold">M</span>
              </div>
              <span style="color:white;font-size:20px;font-weight:700;letter-spacing:-0.5px">MEI<span style="color:#60a5fa">Flow</span></span>
            </div>
          </div>
          <div style="padding:36px">
            <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0f172a">Olá, ${name}! 👋</h1>
            <p style="margin:0 0 20px;font-size:15px;color:#475569;line-height:1.6">
              Você foi cadastrado como cliente de <strong style="color:#1e40af">${businessName}</strong> no MEIFlow.
            </p>
            <div style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:12px;padding:20px;margin-bottom:24px">
              <p style="margin:0;font-size:13px;color:#64748b;line-height:1.6">
                Isso significa que <strong>${businessName}</strong> poderá registrar pagamentos, emitir cobranças e manter o histórico dos serviços prestados a você de forma organizada.
              </p>
            </div>
            <p style="margin:0;font-size:13px;color:#94a3b8">
              Se você não conhece <strong>${businessName}</strong> ou acredita que isso foi um erro, ignore este e-mail com segurança.
            </p>
          </div>
          <div style="padding:20px 36px;border-top:1px solid #f1f5f9;background:#f8fafc">
            <p style="margin:0;font-size:12px;color:#94a3b8">MEIFlow · Gestão financeira para Microempreendedores</p>
          </div>
        </div>
      `,
    }).catch(() => {})
  }

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
