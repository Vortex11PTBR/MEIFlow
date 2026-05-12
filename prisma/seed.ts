import { PrismaClient, TransactionType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding demo tenant...')

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

  type TxInput = {
    desc: string; amt: number; type: TransactionType; cat: string
    yr: number; m: number; d: number; notes?: string | null
  }

  const I = TransactionType.INCOME
  const E = TransactionType.EXPENSE

  const transactions: TxInput[] = [
    // ─── 2023 ───────────────────────────────────────────────
    // Jan 2023
    { desc: 'Criação de site institucional', amt: 2800, type: I, cat: 'Serviços', yr: 2023, m: 0, d: 6, notes: 'Cliente pequena empresa de advocacia' },
    { desc: 'Hospedagem e domínio', amt: 140, type: E, cat: 'Infraestrutura', yr: 2023, m: 0, d: 8 },
    { desc: 'Material escritório', amt: 95, type: E, cat: 'Escritório', yr: 2023, m: 0, d: 12 },
    { desc: 'Suporte mensal', amt: 600, type: I, cat: 'Serviços', yr: 2023, m: 0, d: 18 },

    // Fev 2023
    { desc: 'Desenvolvimento landing page', amt: 1800, type: I, cat: 'Serviços', yr: 2023, m: 1, d: 4 },
    { desc: 'DAS — janeiro', amt: 67.8, type: E, cat: 'Impostos', yr: 2023, m: 1, d: 20 },
    { desc: 'Curso React — Rocketseat', amt: 397, type: E, cat: 'Educação', yr: 2023, m: 1, d: 22 },
    { desc: 'Suporte mensal', amt: 600, type: I, cat: 'Serviços', yr: 2023, m: 1, d: 28 },

    // Mar 2023
    { desc: 'Site e-commerce pequena loja', amt: 3200, type: I, cat: 'Serviços', yr: 2023, m: 2, d: 3, notes: 'Loja de artesanato — WooCommerce' },
    { desc: 'DAS — fevereiro', amt: 67.8, type: E, cat: 'Impostos', yr: 2023, m: 2, d: 20 },
    { desc: 'Uber — reuniões', amt: 78, type: E, cat: 'Transporte', yr: 2023, m: 2, d: 25 },
    { desc: 'Suporte mensal', amt: 600, type: I, cat: 'Serviços', yr: 2023, m: 2, d: 31 },

    // Abr 2023
    { desc: 'Consultoria WordPress', amt: 1400, type: I, cat: 'Serviços', yr: 2023, m: 3, d: 2 },
    { desc: 'Teclado + mouse', amt: 280, type: E, cat: 'Equipamento', yr: 2023, m: 3, d: 8 },
    { desc: 'DAS — março', amt: 67.8, type: E, cat: 'Impostos', yr: 2023, m: 3, d: 20 },
    { desc: 'Suporte mensal', amt: 600, type: I, cat: 'Serviços', yr: 2023, m: 3, d: 28 },

    // Mai 2023
    { desc: 'Sistema de agendamento', amt: 2600, type: I, cat: 'Serviços', yr: 2023, m: 4, d: 5 },
    { desc: 'Google Workspace', amt: 90, type: E, cat: 'Ferramentas', yr: 2023, m: 4, d: 10 },
    { desc: 'DAS — abril', amt: 67.8, type: E, cat: 'Impostos', yr: 2023, m: 4, d: 20 },
    { desc: 'Suporte mensal', amt: 600, type: I, cat: 'Serviços', yr: 2023, m: 4, d: 28 },

    // Jun 2023
    { desc: 'Manutenção sistema cliente', amt: 900, type: I, cat: 'Serviços', yr: 2023, m: 5, d: 6 },
    { desc: 'Almoço com cliente', amt: 72, type: E, cat: 'Alimentação', yr: 2023, m: 5, d: 7 },
    { desc: 'DAS — maio', amt: 67.8, type: E, cat: 'Impostos', yr: 2023, m: 5, d: 20 },
    { desc: 'Suporte mensal', amt: 600, type: I, cat: 'Serviços', yr: 2023, m: 5, d: 28 },

    // Jul 2023
    { desc: 'Redesign de site', amt: 2100, type: I, cat: 'Serviços', yr: 2023, m: 6, d: 3 },
    { desc: 'Assinaturas SaaS', amt: 120, type: E, cat: 'Ferramentas', yr: 2023, m: 6, d: 5 },
    { desc: 'DAS — junho', amt: 67.8, type: E, cat: 'Impostos', yr: 2023, m: 6, d: 20 },
    { desc: 'Suporte mensal', amt: 600, type: I, cat: 'Serviços', yr: 2023, m: 6, d: 28 },

    // Ago 2023
    { desc: 'Desenvolvimento API REST', amt: 2900, type: I, cat: 'Serviços', yr: 2023, m: 7, d: 7, notes: 'Integração com sistema de pagamento' },
    { desc: 'Livros técnicos', amt: 210, type: E, cat: 'Educação', yr: 2023, m: 7, d: 12 },
    { desc: 'DAS — julho', amt: 67.8, type: E, cat: 'Impostos', yr: 2023, m: 7, d: 20 },
    { desc: 'Suporte mensal', amt: 600, type: I, cat: 'Serviços', yr: 2023, m: 7, d: 28 },

    // Set 2023
    { desc: 'Site para clínica veterinária', amt: 3400, type: I, cat: 'Serviços', yr: 2023, m: 8, d: 4 },
    { desc: 'Transporte — reuniões', amt: 110, type: E, cat: 'Transporte', yr: 2023, m: 8, d: 15 },
    { desc: 'DAS — agosto', amt: 67.8, type: E, cat: 'Impostos', yr: 2023, m: 8, d: 20 },
    { desc: 'Suporte mensal', amt: 600, type: I, cat: 'Serviços', yr: 2023, m: 8, d: 28 },

    // Out 2023
    { desc: 'Dashboard administrativo', amt: 3800, type: I, cat: 'Serviços', yr: 2023, m: 9, d: 2 },
    { desc: 'Mouse gamer', amt: 180, type: E, cat: 'Equipamento', yr: 2023, m: 9, d: 10 },
    { desc: 'DAS — setembro', amt: 67.8, type: E, cat: 'Impostos', yr: 2023, m: 9, d: 20 },
    { desc: 'Suporte mensal', amt: 900, type: I, cat: 'Serviços', yr: 2023, m: 9, d: 28 },

    // Nov 2023
    { desc: 'Consultoria em UX', amt: 2200, type: I, cat: 'Serviços', yr: 2023, m: 10, d: 6 },
    { desc: 'Google Ads', amt: 250, type: E, cat: 'Marketing', yr: 2023, m: 10, d: 10 },
    { desc: 'DAS — outubro', amt: 67.8, type: E, cat: 'Impostos', yr: 2023, m: 10, d: 20 },
    { desc: 'Suporte mensal', amt: 900, type: I, cat: 'Serviços', yr: 2023, m: 10, d: 28 },

    // Dez 2023
    { desc: 'Projeto de fim de ano', amt: 4200, type: I, cat: 'Serviços', yr: 2023, m: 11, d: 5, notes: 'Sistema de controle de estoque' },
    { desc: 'Licença Windows + Office', amt: 420, type: E, cat: 'Ferramentas', yr: 2023, m: 11, d: 8 },
    { desc: 'DAS — novembro', amt: 67.8, type: E, cat: 'Impostos', yr: 2023, m: 11, d: 20 },
    { desc: 'Suporte mensal', amt: 900, type: I, cat: 'Serviços', yr: 2023, m: 11, d: 28 },

    // ─── 2024 ───────────────────────────────────────────────
    // Jan 2024
    { desc: 'Desenvolvimento sistema de gestão', amt: 4500, type: I, cat: 'Serviços', yr: 2024, m: 0, d: 5, notes: 'Sistema de ponto eletrônico' },
    { desc: 'Domínio e hospedagem', amt: 160, type: E, cat: 'Infraestrutura', yr: 2024, m: 0, d: 8 },
    { desc: 'Curso Next.js', amt: 297, type: E, cat: 'Educação', yr: 2024, m: 0, d: 15 },
    { desc: 'Suporte mensal — Alpha', amt: 1200, type: I, cat: 'Serviços', yr: 2024, m: 0, d: 18 },

    // Fev 2024
    { desc: 'App mobile React Native', amt: 5200, type: I, cat: 'Serviços', yr: 2024, m: 1, d: 3, notes: 'App de delivery para restaurante' },
    { desc: 'DAS — janeiro', amt: 70.6, type: E, cat: 'Impostos', yr: 2024, m: 1, d: 20 },
    { desc: 'Google Ads', amt: 280, type: E, cat: 'Marketing', yr: 2024, m: 1, d: 22 },
    { desc: 'Suporte mensal — Alpha', amt: 1200, type: I, cat: 'Serviços', yr: 2024, m: 1, d: 28 },

    // Mar 2024
    { desc: 'API de integração bancária', amt: 3800, type: I, cat: 'Serviços', yr: 2024, m: 2, d: 4 },
    { desc: 'Monitor Dell 27"', amt: 1650, type: E, cat: 'Equipamento', yr: 2024, m: 2, d: 10 },
    { desc: 'DAS — fevereiro', amt: 70.6, type: E, cat: 'Impostos', yr: 2024, m: 2, d: 20 },
    { desc: 'Suporte mensal — Alpha', amt: 1200, type: I, cat: 'Serviços', yr: 2024, m: 2, d: 28 },
    { desc: 'Treinamento equipe cliente', amt: 1600, type: I, cat: 'Treinamento', yr: 2024, m: 2, d: 22 },

    // Abr 2024
    { desc: 'Plataforma de e-learning', amt: 5600, type: I, cat: 'Serviços', yr: 2024, m: 3, d: 2, notes: 'Plataforma com 10 cursos em vídeo' },
    { desc: 'Meta Ads campanha', amt: 380, type: E, cat: 'Marketing', yr: 2024, m: 3, d: 5 },
    { desc: 'Assinaturas (Vercel, GitHub)', amt: 180, type: E, cat: 'Ferramentas', yr: 2024, m: 3, d: 8 },
    { desc: 'DAS — março', amt: 70.6, type: E, cat: 'Impostos', yr: 2024, m: 3, d: 20 },
    { desc: 'Suporte mensal — Alpha', amt: 1200, type: I, cat: 'Serviços', yr: 2024, m: 3, d: 28 },

    // Mai 2024
    { desc: 'Consultoria em arquitetura cloud', amt: 4200, type: I, cat: 'Serviços', yr: 2024, m: 4, d: 6 },
    { desc: 'Faxina escritório', amt: 150, type: E, cat: 'Manutenção', yr: 2024, m: 4, d: 10 },
    { desc: 'DAS — abril', amt: 70.6, type: E, cat: 'Impostos', yr: 2024, m: 4, d: 20 },
    { desc: 'Suporte mensal — Alpha', amt: 1200, type: I, cat: 'Serviços', yr: 2024, m: 4, d: 28 },

    // Jun 2024
    { desc: 'Desenvolvimento PWA', amt: 3600, type: I, cat: 'Serviços', yr: 2024, m: 5, d: 3 },
    { desc: 'Uber — clientes', amt: 95, type: E, cat: 'Transporte', yr: 2024, m: 5, d: 10 },
    { desc: 'DAS — maio', amt: 70.6, type: E, cat: 'Impostos', yr: 2024, m: 5, d: 20 },
    { desc: 'Suporte mensal — Alpha', amt: 1200, type: I, cat: 'Serviços', yr: 2024, m: 5, d: 28 },

    // Jul 2024
    { desc: 'Sistema CRM customizado', amt: 6500, type: I, cat: 'Serviços', yr: 2024, m: 6, d: 5, notes: 'CRM para imobiliária — 2 meses de trabalho' },
    { desc: 'Cadeira ergonômica', amt: 980, type: E, cat: 'Equipamento', yr: 2024, m: 6, d: 8 },
    { desc: 'DAS — junho', amt: 70.6, type: E, cat: 'Impostos', yr: 2024, m: 6, d: 20 },
    { desc: 'Suporte mensal — Alpha', amt: 1500, type: I, cat: 'Serviços', yr: 2024, m: 6, d: 28 },

    // Ago 2024
    { desc: 'Automação de processos', amt: 4800, type: I, cat: 'Serviços', yr: 2024, m: 7, d: 4 },
    { desc: 'Google Ads', amt: 350, type: E, cat: 'Marketing', yr: 2024, m: 7, d: 8 },
    { desc: 'DAS — julho', amt: 70.6, type: E, cat: 'Impostos', yr: 2024, m: 7, d: 20 },
    { desc: 'Suporte mensal — Alpha', amt: 1500, type: I, cat: 'Serviços', yr: 2024, m: 7, d: 28 },

    // Set 2024
    { desc: 'Integração com gateway de pagamento', amt: 3900, type: I, cat: 'Serviços', yr: 2024, m: 8, d: 3 },
    { desc: 'Assinaturas ferramentas', amt: 210, type: E, cat: 'Ferramentas', yr: 2024, m: 8, d: 7 },
    { desc: 'DAS — agosto', amt: 70.6, type: E, cat: 'Impostos', yr: 2024, m: 8, d: 20 },
    { desc: 'Suporte mensal — Alpha', amt: 1500, type: I, cat: 'Serviços', yr: 2024, m: 8, d: 28 },

    // Out 2024
    { desc: 'App de gestão de obras', amt: 5100, type: I, cat: 'Serviços', yr: 2024, m: 9, d: 2 },
    { desc: 'Almoço cliente', amt: 88, type: E, cat: 'Alimentação', yr: 2024, m: 9, d: 5 },
    { desc: 'DAS — setembro', amt: 70.6, type: E, cat: 'Impostos', yr: 2024, m: 9, d: 20 },
    { desc: 'Suporte mensal — Alpha', amt: 1500, type: I, cat: 'Serviços', yr: 2024, m: 9, d: 28 },

    // Nov 2024
    { desc: 'Plataforma SaaS — MVP', amt: 5800, type: I, cat: 'Serviços', yr: 2024, m: 10, d: 4, notes: 'MVP de sistema de ponto para RH' },
    { desc: 'Meta Ads', amt: 420, type: E, cat: 'Marketing', yr: 2024, m: 10, d: 7 },
    { desc: 'DAS — outubro', amt: 70.6, type: E, cat: 'Impostos', yr: 2024, m: 10, d: 20 },
    { desc: 'Suporte mensal — Alpha', amt: 1500, type: I, cat: 'Serviços', yr: 2024, m: 10, d: 28 },

    // Dez 2024
    { desc: 'Projeto Black Friday — loja', amt: 4600, type: I, cat: 'Serviços', yr: 2024, m: 11, d: 3 },
    { desc: 'Licenças anuais software', amt: 580, type: E, cat: 'Ferramentas', yr: 2024, m: 11, d: 5 },
    { desc: 'DAS — novembro', amt: 70.6, type: E, cat: 'Impostos', yr: 2024, m: 11, d: 20 },
    { desc: 'Suporte mensal — Alpha', amt: 1800, type: I, cat: 'Serviços', yr: 2024, m: 11, d: 28 },

    // ─── 2025 ───────────────────────────────────────────────
    // Jan 2025
    { desc: 'Desenvolvimento de sistema web', amt: 5200, type: I, cat: 'Serviços', yr: 2025, m: 0, d: 5, notes: 'Pagamento via PIX · Projeto Alfa v2.0' },
    { desc: 'Domínio e hospedagem', amt: 180, type: E, cat: 'Infraestrutura', yr: 2025, m: 0, d: 8, notes: 'Renovação anual Cloudflare + Neon' },
    { desc: 'Consultoria em cloud', amt: 1200, type: I, cat: 'Serviços', yr: 2025, m: 0, d: 15 },
    { desc: 'Almoço com cliente', amt: 94, type: E, cat: 'Alimentação', yr: 2025, m: 0, d: 15 },
    { desc: 'Curso online TypeScript', amt: 297, type: E, cat: 'Educação', yr: 2025, m: 0, d: 22 },

    // Fev 2025
    { desc: 'Manutenção de sistema', amt: 2800, type: I, cat: 'Serviços', yr: 2025, m: 1, d: 3, notes: 'Cliente Empresa Alpha · retainer mensal' },
    { desc: 'Google Ads campanha', amt: 320, type: E, cat: 'Marketing', yr: 2025, m: 1, d: 7 },
    { desc: 'Desenvolvimento de API', amt: 3800, type: I, cat: 'Serviços', yr: 2025, m: 1, d: 18, notes: 'API REST para integração com ERP' },
    { desc: 'Uber — visita cliente', amt: 56, type: E, cat: 'Transporte', yr: 2025, m: 1, d: 18 },
    { desc: 'Assinaturas SaaS (GitHub, Figma)', amt: 145, type: E, cat: 'Ferramentas', yr: 2025, m: 1, d: 25, notes: 'GitHub Copilot + Figma Pro' },

    // Mar 2025
    { desc: 'Consultoria em arquitetura de software', amt: 4500, type: I, cat: 'Serviços', yr: 2025, m: 2, d: 2, notes: 'Pagamento via TED · 3 sessões' },
    { desc: 'Monitor 4K Dell', amt: 1890, type: E, cat: 'Equipamento', yr: 2025, m: 2, d: 10, notes: 'Dell U2723QE · nota fiscal 4521' },
    { desc: 'Treinamento equipe cliente', amt: 1800, type: I, cat: 'Treinamento', yr: 2025, m: 2, d: 14 },
    { desc: 'DAS — fevereiro', amt: 75.9, type: E, cat: 'Impostos', yr: 2025, m: 2, d: 20, notes: 'Pago via app Receita Federal' },
    { desc: 'Café e material escritório', amt: 87, type: E, cat: 'Escritório', yr: 2025, m: 2, d: 28 },

    // Abr 2025
    { desc: 'Desenvolvimento app mobile', amt: 5800, type: I, cat: 'Serviços', yr: 2025, m: 3, d: 1, notes: 'App React Native · 50% sinal' },
    { desc: 'Marketing digital — Meta Ads', amt: 450, type: E, cat: 'Marketing', yr: 2025, m: 3, d: 5 },
    { desc: 'Integração com ERP cliente', amt: 1180, type: I, cat: 'Serviços', yr: 2025, m: 3, d: 11 },
    { desc: 'DAS — março', amt: 75.9, type: E, cat: 'Impostos', yr: 2025, m: 3, d: 20, notes: 'Pago via app Receita Federal' },
    { desc: 'Teclado mecânico', amt: 390, type: E, cat: 'Equipamento', yr: 2025, m: 3, d: 24, notes: 'Keychron K2 Pro' },

    // Mai 2025
    { desc: 'Consultoria em segurança', amt: 3200, type: I, cat: 'Serviços', yr: 2025, m: 4, d: 2, notes: 'Auditoria de segurança e relatório' },
    { desc: 'Serviço de design — freelancer', amt: 800, type: E, cat: 'Serviços', yr: 2025, m: 4, d: 5, notes: 'Design UI para apresentação' },
    { desc: 'Desenvolvimento de site institucional', amt: 2400, type: I, cat: 'Serviços', yr: 2025, m: 4, d: 7, notes: 'Pagamento via PIX · saldo final' },
    { desc: 'Almoço com cliente', amt: 87, type: E, cat: 'Alimentação', yr: 2025, m: 4, d: 9 },
    { desc: 'Google Ads campanha', amt: 350, type: E, cat: 'Marketing', yr: 2025, m: 4, d: 10 },
    { desc: 'Manutenção sistemas — retainer', amt: 1800, type: I, cat: 'Serviços', yr: 2025, m: 4, d: 12, notes: 'Retainer mensal · suporte e manutenção' },
    { desc: 'Uber — visita cliente', amt: 42, type: E, cat: 'Transporte', yr: 2025, m: 4, d: 12 },
    { desc: 'DAS — abril', amt: 75.9, type: E, cat: 'Impostos', yr: 2025, m: 4, d: 20, notes: 'Pago via app Receita Federal' },
  ]

  await prisma.transaction.createMany({
    data: transactions.map(t => ({
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

  console.log(`Demo tenant: ${demo.razaoSocial}`)
  console.log(`${transactions.length} transacoes inseridas (2023, 2024, 2025)`)
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
