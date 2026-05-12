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
    { desc: 'Desenvolvimento de sistema web', amt: 5200, type: TransactionType.INCOME, cat: 'Serviços', m: 0, d: 5, clientId: clientA.id },
    { desc: 'Domínio e hospedagem', amt: 180, type: TransactionType.EXPENSE, cat: 'Infraestrutura', m: 0, d: 8 },
    { desc: 'Consultoria em cloud', amt: 1200, type: TransactionType.INCOME, cat: 'Serviços', m: 0, d: 15, clientId: clientB.id },
    { desc: 'Almoço com cliente', amt: 94, type: TransactionType.EXPENSE, cat: 'Alimentação', m: 0, d: 15 },
    { desc: 'Curso online TypeScript', amt: 297, type: TransactionType.EXPENSE, cat: 'Educação', m: 0, d: 22 },

    // Fevereiro
    { desc: 'Manutenção de sistema', amt: 2800, type: TransactionType.INCOME, cat: 'Serviços', m: 1, d: 3, clientId: clientA.id },
    { desc: 'Google Ads campanha', amt: 320, type: TransactionType.EXPENSE, cat: 'Marketing', m: 1, d: 7 },
    { desc: 'Desenvolvimento de API', amt: 3800, type: TransactionType.INCOME, cat: 'Serviços', m: 1, d: 18, clientId: clientB.id },
    { desc: 'Uber — visita cliente', amt: 56, type: TransactionType.EXPENSE, cat: 'Transporte', m: 1, d: 18 },
    { desc: 'Assinaturas SaaS (VSCode, Figma)', amt: 145, type: TransactionType.EXPENSE, cat: 'Ferramentas', m: 1, d: 25 },

    // Março
    { desc: 'Consultoria em arquitetura de software', amt: 4500, type: TransactionType.INCOME, cat: 'Serviços', m: 2, d: 2, clientId: clientA.id },
    { desc: 'Monitor 4K Dell', amt: 1890, type: TransactionType.EXPENSE, cat: 'Equipamento', m: 2, d: 10 },
    { desc: 'Treinamento equipe cliente', amt: 1800, type: TransactionType.INCOME, cat: 'Treinamento', m: 2, d: 14, clientId: clientB.id },
    { desc: 'DAS — fevereiro', amt: 75.9, type: TransactionType.EXPENSE, cat: 'Impostos', m: 2, d: 20 },
    { desc: 'Café e material escritório', amt: 87, type: TransactionType.EXPENSE, cat: 'Escritório', m: 2, d: 28 },

    // Abril
    { desc: 'Desenvolvimento app mobile', amt: 5800, type: TransactionType.INCOME, cat: 'Serviços', m: 3, d: 1, clientId: clientA.id },
    { desc: 'Marketing digital — Meta Ads', amt: 450, type: TransactionType.EXPENSE, cat: 'Marketing', m: 3, d: 5 },
    { desc: 'Integração com ERP cliente', amt: 1180, type: TransactionType.INCOME, cat: 'Serviços', m: 3, d: 11, clientId: clientB.id },
    { desc: 'DAS — março', amt: 75.9, type: TransactionType.EXPENSE, cat: 'Impostos', m: 3, d: 20 },
    { desc: 'Equipamento — teclado mecânico', amt: 390, type: TransactionType.EXPENSE, cat: 'Equipamento', m: 3, d: 24 },

    // Maio (parcial — mês atual)
    { desc: 'Consultoria em segurança', amt: 3200, type: TransactionType.INCOME, cat: 'Serviços', m: 4, d: 2, clientId: clientA.id },
    { desc: 'Serviço de design — freelancer', amt: 800, type: TransactionType.EXPENSE, cat: 'Serviços', m: 4, d: 5 },
    { desc: 'Desenvolvimento de site institucional', amt: 2400, type: TransactionType.INCOME, cat: 'Serviços', m: 4, d: 7, clientId: clientB.id },
    { desc: 'Almoço com cliente', amt: 87, type: TransactionType.EXPENSE, cat: 'Alimentação', m: 4, d: 9 },
    { desc: 'Google Ads campanha', amt: 350, type: TransactionType.EXPENSE, cat: 'Marketing', m: 4, d: 10 },
    { desc: 'Manutenção sistemas — retainer', amt: 1800, type: TransactionType.INCOME, cat: 'Serviços', m: 4, d: 12, clientId: clientA.id },
    { desc: 'Uber — visita cliente', amt: 42, type: TransactionType.EXPENSE, cat: 'Transporte', m: 4, d: 12 },
    { desc: 'DAS — abril', amt: 75.9, type: TransactionType.EXPENSE, cat: 'Impostos', m: 4, d: 20 },
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
