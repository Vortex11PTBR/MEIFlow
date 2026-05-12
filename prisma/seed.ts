import { PrismaClient, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()
const I = TransactionType.INCOME
const E = TransactionType.EXPENSE

type Tx = {
  desc: string; amt: number; type: TransactionType; cat: string
  yr: number; m: number; d: number; notes?: string | null
}

function buildYear(y: number, das: number, incomeBase: number): Tx[] {
  const scale = (v: number) => Math.round(v * 10) / 10
  return [
    // Jan
    { desc: 'Desenvolvimento de sistema web', amt: scale(incomeBase * 1.0), type: I, cat: 'Serviços', yr: y, m: 0, d: 5 },
    { desc: 'Hospedagem e domínio', amt: 160, type: E, cat: 'Infraestrutura', yr: y, m: 0, d: 8 },
    { desc: 'Suporte mensal — Alpha', amt: scale(incomeBase * 0.28), type: I, cat: 'Serviços', yr: y, m: 0, d: 18 },
    { desc: 'Curso online', amt: 297, type: E, cat: 'Educação', yr: y, m: 0, d: 22 },
    // Feb
    { desc: 'Manutenção de sistema', amt: scale(incomeBase * 0.75), type: I, cat: 'Serviços', yr: y, m: 1, d: 3 },
    { desc: 'Google Ads campanha', amt: 320, type: E, cat: 'Marketing', yr: y, m: 1, d: 7 },
    { desc: 'Desenvolvimento de API', amt: scale(incomeBase * 0.9), type: I, cat: 'Serviços', yr: y, m: 1, d: 18, notes: 'API REST para integração com ERP' },
    { desc: `DAS — janeiro ${y}`, amt: das, type: E, cat: 'Impostos', yr: y, m: 1, d: 20 },
    { desc: 'Assinaturas SaaS', amt: 145, type: E, cat: 'Ferramentas', yr: y, m: 1, d: 25 },
    // Mar
    { desc: 'Consultoria em arquitetura', amt: scale(incomeBase * 1.1), type: I, cat: 'Serviços', yr: y, m: 2, d: 2 },
    { desc: 'Equipamento — monitor', amt: 1890, type: E, cat: 'Equipamento', yr: y, m: 2, d: 10 },
    { desc: 'Treinamento equipe cliente', amt: scale(incomeBase * 0.4), type: I, cat: 'Treinamento', yr: y, m: 2, d: 14 },
    { desc: `DAS — fevereiro ${y}`, amt: das, type: E, cat: 'Impostos', yr: y, m: 2, d: 20 },
    // Apr
    { desc: 'Desenvolvimento app mobile', amt: scale(incomeBase * 1.35), type: I, cat: 'Serviços', yr: y, m: 3, d: 1, notes: '50% sinal recebido' },
    { desc: 'Meta Ads campanha', amt: 450, type: E, cat: 'Marketing', yr: y, m: 3, d: 5 },
    { desc: 'Integração com ERP', amt: scale(incomeBase * 0.3), type: I, cat: 'Serviços', yr: y, m: 3, d: 11 },
    { desc: `DAS — março ${y}`, amt: das, type: E, cat: 'Impostos', yr: y, m: 3, d: 20 },
    // May
    { desc: 'Consultoria em segurança', amt: scale(incomeBase * 0.8), type: I, cat: 'Serviços', yr: y, m: 4, d: 2 },
    { desc: 'Serviço de design', amt: 800, type: E, cat: 'Serviços', yr: y, m: 4, d: 5 },
    { desc: 'Site institucional', amt: scale(incomeBase * 0.6), type: I, cat: 'Serviços', yr: y, m: 4, d: 7 },
    { desc: 'Almoço com cliente', amt: 87, type: E, cat: 'Alimentação', yr: y, m: 4, d: 9 },
    { desc: `DAS — abril ${y}`, amt: das, type: E, cat: 'Impostos', yr: y, m: 4, d: 20 },
    // Jun
    { desc: 'Sistema de agendamento online', amt: scale(incomeBase * 0.95), type: I, cat: 'Serviços', yr: y, m: 5, d: 3 },
    { desc: 'Uber — reuniões com clientes', amt: 95, type: E, cat: 'Transporte', yr: y, m: 5, d: 10 },
    { desc: 'Suporte mensal', amt: scale(incomeBase * 0.28), type: I, cat: 'Serviços', yr: y, m: 5, d: 18 },
    { desc: `DAS — maio ${y}`, amt: das, type: E, cat: 'Impostos', yr: y, m: 5, d: 20 },
    // Jul
    { desc: 'Plataforma e-commerce', amt: scale(incomeBase * 1.5), type: I, cat: 'Serviços', yr: y, m: 6, d: 4, notes: 'Projeto grande — loja virtual completa' },
    { desc: 'Assinaturas ferramentas', amt: 210, type: E, cat: 'Ferramentas', yr: y, m: 6, d: 8 },
    { desc: `DAS — junho ${y}`, amt: das, type: E, cat: 'Impostos', yr: y, m: 6, d: 20 },
    // Aug
    { desc: 'Automação de processos internos', amt: scale(incomeBase * 1.2), type: I, cat: 'Serviços', yr: y, m: 7, d: 6 },
    { desc: 'Google Ads', amt: 350, type: E, cat: 'Marketing', yr: y, m: 7, d: 8 },
    { desc: `DAS — julho ${y}`, amt: das, type: E, cat: 'Impostos', yr: y, m: 7, d: 20 },
    { desc: 'Suporte mensal', amt: scale(incomeBase * 0.28), type: I, cat: 'Serviços', yr: y, m: 7, d: 28 },
    // Sep
    { desc: 'Integração gateway de pagamento', amt: scale(incomeBase * 1.0), type: I, cat: 'Serviços', yr: y, m: 8, d: 4 },
    { desc: 'Ferramentas de desenvolvimento', amt: 180, type: E, cat: 'Ferramentas', yr: y, m: 8, d: 9 },
    { desc: `DAS — agosto ${y}`, amt: das, type: E, cat: 'Impostos', yr: y, m: 8, d: 20 },
    { desc: 'Suporte mensal', amt: scale(incomeBase * 0.35), type: I, cat: 'Serviços', yr: y, m: 8, d: 28 },
    // Oct
    { desc: 'App de gestão de obras', amt: scale(incomeBase * 1.3), type: I, cat: 'Serviços', yr: y, m: 9, d: 3 },
    { desc: 'Almoço cliente', amt: 88, type: E, cat: 'Alimentação', yr: y, m: 9, d: 7 },
    { desc: `DAS — setembro ${y}`, amt: das, type: E, cat: 'Impostos', yr: y, m: 9, d: 20 },
    { desc: 'Suporte mensal', amt: scale(incomeBase * 0.35), type: I, cat: 'Serviços', yr: y, m: 9, d: 28 },
    // Nov
    { desc: 'Plataforma SaaS — MVP', amt: scale(incomeBase * 1.4), type: I, cat: 'Serviços', yr: y, m: 10, d: 5, notes: 'MVP entregue com sucesso' },
    { desc: 'Meta Ads', amt: 420, type: E, cat: 'Marketing', yr: y, m: 10, d: 7 },
    { desc: `DAS — outubro ${y}`, amt: das, type: E, cat: 'Impostos', yr: y, m: 10, d: 20 },
    { desc: 'Suporte mensal', amt: scale(incomeBase * 0.4), type: I, cat: 'Serviços', yr: y, m: 10, d: 28 },
    // Dec
    { desc: 'Projeto Black Friday — loja virtual', amt: scale(incomeBase * 1.1), type: I, cat: 'Serviços', yr: y, m: 11, d: 4 },
    { desc: 'Licenças anuais software', amt: 580, type: E, cat: 'Ferramentas', yr: y, m: 11, d: 6 },
    { desc: `DAS — novembro ${y}`, amt: das, type: E, cat: 'Impostos', yr: y, m: 11, d: 20 },
    { desc: 'Suporte mensal', amt: scale(incomeBase * 0.4), type: I, cat: 'Serviços', yr: y, m: 11, d: 28 },
  ]
}

async function main() {
  const now = new Date()
  const y = now.getFullYear()   // current year (e.g. 2026)
  const cm = now.getMonth()     // current month index 0-11

  console.log(`Seeding demo data — current year: ${y}, current month: ${cm + 1}`)

  const demo = await prisma.tenant.upsert({
    where: { cnpj: '12345678000190' },
    update: {},
    create: {
      cnpj: '12345678000190',
      razaoSocial: 'JOÃO SILVA SERVIÇOS DE TI LTDA',
      nomeFantasia: 'João Tech',
      email: 'joao@exemplo.com.br',
      isDemo: true,
    },
  })

  await prisma.client.upsert({
    where: { id: 'client-demo-a' },
    update: {},
    create: { id: 'client-demo-a', tenantId: demo.id, name: 'Empresa Alpha Ltda', cnpj: '98765432000111', email: 'contato@alpha.com.br' },
  })
  await prisma.client.upsert({
    where: { id: 'client-demo-b' },
    update: {},
    create: { id: 'client-demo-b', tenantId: demo.id, name: 'Beta Consultoria', email: 'beta@consultoria.com.br' },
  })
  await prisma.client.upsert({
    where: { id: 'client-demo-c' },
    update: {},
    create: { id: 'client-demo-c', tenantId: demo.id, name: 'Gama Digital', email: 'gama@digital.com.br', phone: '(11) 98765-4321' },
  })

  await prisma.transaction.deleteMany({ where: { tenantId: demo.id } })

  // Generate 4 years of data with growing income
  // DAS values by year relative to current
  const yearData = [
    { yr: y - 3, das: 67.80, incomeBase: 3200 },  // e.g. 2023 — starting out
    { yr: y - 2, das: 70.60, incomeBase: 4400 },  // e.g. 2024 — growing
    { yr: y - 1, das: 75.90, incomeBase: 5600 },  // e.g. 2025 — established
    { yr: y,     das: 75.90, incomeBase: 6800 },  // e.g. 2026 — thriving
  ]

  const allTx: Tx[] = []
  for (const { yr, das, incomeBase } of yearData) {
    const months = buildYear(yr, das, incomeBase)
    // Only include months up to current month for current year
    const filtered = months.filter(t => t.yr < y || t.m <= cm)
    allTx.push(...filtered)
  }

  await prisma.transaction.createMany({
    data: allTx.map(t => ({
      tenantId: demo.id,
      description: t.desc,
      amount: t.amt,
      type: t.type,
      category: t.cat,
      date: new Date(t.yr, t.m, t.d),
      notes: t.notes ?? null,
      aiCategorized: true,
    })),
  })

  console.log(`Tenant: ${demo.razaoSocial}`)
  console.log(`${allTx.length} transacoes inseridas (${y - 3}–${y})`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
