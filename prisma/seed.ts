import { PrismaClient, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding demo tenant...')

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

  const clientA = await prisma.client.upsert({
    where: { id: 'client-demo-a' },
    update: {},
    create: {
      id: 'client-demo-a',
      tenantId: demo.id,
      name: 'Empresa Alpha Ltda',
      cnpj: '98765432000111',
      email: 'contato@alpha.com.br',
    },
  })

  const clientB = await prisma.client.upsert({
    where: { id: 'client-demo-b' },
    update: {},
    create: {
      id: 'client-demo-b',
      tenantId: demo.id,
      name: 'Beta Consultoria',
      email: 'beta@consultoria.com.br',
    },
  })

  // Clear existing demo transactions
  await prisma.transaction.deleteMany({ where: { tenantId: demo.id } })

  const now = new Date()
  const year = now.getFullYear()

  const transactions = [
    // Janeiro
    { desc: 'Desenvolvimento de sistema web', amt: 5200, type: TransactionType.INCOME, cat: 'Serviços', m: 0, d: 5, clientId: clientA.id, notes: 'Pagamento via PIX · Projeto Alfa v2.0' },
    { desc: 'Domínio e hospedagem', amt: 180, type: TransactionType.EXPENSE, cat: 'Infraestrutura', m: 0, d: 8, notes: 'Renovação anual Cloudflare + Neon' },
    { desc: 'Consultoria em cloud', amt: 1200, type: TransactionType.INCOME, cat: 'Serviços', m: 0, d: 15, clientId: clientB.id, notes: null },
    { desc: 'Almoço com cliente', amt: 94, type: TransactionType.EXPENSE, cat: 'Alimentação', m: 0, d: 15, notes: null },
    { desc: 'Curso online TypeScript', amt: 297, type: TransactionType.EXPENSE, cat: 'Educação', m: 0, d: 22, notes: 'Udemy — TypeScript avançado' },

    // Fevereiro
    { desc: 'Manutenção de sistema', amt: 2800, type: TransactionType.INCOME, cat: 'Serviços', m: 1, d: 3, clientId: clientA.id, notes: 'Cliente Empresa Alpha · retainer mensal' },
    { desc: 'Google Ads campanha', amt: 320, type: TransactionType.EXPENSE, cat: 'Marketing', m: 1, d: 7, notes: null },
    { desc: 'Desenvolvimento de API', amt: 3800, type: TransactionType.INCOME, cat: 'Serviços', m: 1, d: 18, clientId: clientB.id, notes: 'API REST para integração com ERP' },
    { desc: 'Uber — visita cliente', amt: 56, type: TransactionType.EXPENSE, cat: 'Transporte', m: 1, d: 18, notes: null },
    { desc: 'Assinaturas SaaS (VSCode, Figma)', amt: 145, type: TransactionType.EXPENSE, cat: 'Ferramentas', m: 1, d: 25, notes: 'GitHub Copilot + Figma Pro' },

    // Março
    { desc: 'Consultoria em arquitetura de software', amt: 4500, type: TransactionType.INCOME, cat: 'Serviços', m: 2, d: 2, clientId: clientA.id, notes: 'Pagamento via TED · 3 sessões' },
    { desc: 'Monitor 4K Dell', amt: 1890, type: TransactionType.EXPENSE, cat: 'Equipamento', m: 2, d: 10, notes: 'Dell U2723QE · nota fiscal 4521' },
    { desc: 'Treinamento equipe cliente', amt: 1800, type: TransactionType.INCOME, cat: 'Treinamento', m: 2, d: 14, clientId: clientB.id, notes: null },
    { desc: 'DAS — fevereiro', amt: 75.9, type: TransactionType.EXPENSE, cat: 'Impostos', m: 2, d: 20, notes: 'Pago via app Receita Federal' },
    { desc: 'Café e material escritório', amt: 87, type: TransactionType.EXPENSE, cat: 'Escritório', m: 2, d: 28, notes: null },

    // Abril
    { desc: 'Desenvolvimento app mobile', amt: 5800, type: TransactionType.INCOME, cat: 'Serviços', m: 3, d: 1, clientId: clientA.id, notes: 'App React Native · 50% sinal' },
    { desc: 'Marketing digital — Meta Ads', amt: 450, type: TransactionType.EXPENSE, cat: 'Marketing', m: 3, d: 5, notes: null },
    { desc: 'Integração com ERP cliente', amt: 1180, type: TransactionType.INCOME, cat: 'Serviços', m: 3, d: 11, clientId: clientB.id, notes: null },
    { desc: 'DAS — março', amt: 75.9, type: TransactionType.EXPENSE, cat: 'Impostos', m: 3, d: 20, notes: 'Pago via app Receita Federal' },
    { desc: 'Equipamento — teclado mecânico', amt: 390, type: TransactionType.EXPENSE, cat: 'Equipamento', m: 3, d: 24, notes: 'Keychron K2 Pro' },

    // Maio (parcial — mês atual)
    { desc: 'Consultoria em segurança', amt: 3200, type: TransactionType.INCOME, cat: 'Serviços', m: 4, d: 2, clientId: clientA.id, notes: 'Auditoria de segurança e relatório' },
    { desc: 'Serviço de design — freelancer', amt: 800, type: TransactionType.EXPENSE, cat: 'Serviços', m: 4, d: 5, notes: 'Design UI para apresentação' },
    { desc: 'Desenvolvimento de site institucional', amt: 2400, type: TransactionType.INCOME, cat: 'Serviços', m: 4, d: 7, clientId: clientB.id, notes: 'Pagamento via PIX · saldo final' },
    { desc: 'Almoço com cliente', amt: 87, type: TransactionType.EXPENSE, cat: 'Alimentação', m: 4, d: 9, notes: null },
    { desc: 'Google Ads campanha', amt: 350, type: TransactionType.EXPENSE, cat: 'Marketing', m: 4, d: 10, notes: null },
    { desc: 'Manutenção sistemas — retainer', amt: 1800, type: TransactionType.INCOME, cat: 'Serviços', m: 4, d: 12, clientId: clientA.id, notes: 'Retainer mensal · suporte e manutenção' },
    { desc: 'Uber — visita cliente', amt: 42, type: TransactionType.EXPENSE, cat: 'Transporte', m: 4, d: 12, notes: null },
    { desc: 'DAS — abril', amt: 75.9, type: TransactionType.EXPENSE, cat: 'Impostos', m: 4, d: 20, notes: 'Pago via app Receita Federal' },
  ]

  for (const t of transactions) {
    await prisma.transaction.create({
      data: {
        tenantId: demo.id,
        description: t.desc,
        amount: t.amt,
        type: t.type,
        category: t.cat,
        date: new Date(year, t.m, t.d),
        clientId: (t as { clientId?: string }).clientId ?? null,
        notes: t.notes ?? null,
        aiCategorized: true,
      },
    })
  }

  console.log(`✅ Demo tenant criado: ${demo.razaoSocial}`)
  console.log(`✅ ${transactions.length} transações inseridas`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
