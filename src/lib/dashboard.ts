import { TransactionType } from '@prisma/client'
import { unstable_cache } from 'next/cache'
import { prisma } from './db'
import { MEI_ANNUAL_LIMIT } from './utils'

export interface DashboardData {
  tenantName: string
  tenantCNPJ: string
  monthIncome: number
  monthExpense: number
  monthProfit: number
  yearIncome: number
  limitPct: number
  limitRemaining: number
  activeClients: number
  monthlyBreakdown: { month: string; label: string; income: number; expense: number }[]
  weeklyBreakdown: { day: string; income: number; expense: number }[]
  expenseCategories: Record<string, number>
  recentTransactions: {
    id: string
    description: string
    amount: number
    type: 'INCOME' | 'EXPENSE'
    category: string
    date: string
    aiCategorized: boolean
    notes: string | null
  }[]
}

async function _getDashboardData(cnpj: string): Promise<DashboardData> {
  const now = new Date()
  const year = now.getFullYear()
  const monthStart = new Date(year, now.getMonth(), 1)
  const monthEnd = new Date(year, now.getMonth() + 1, 0, 23, 59, 59)
  const yearStart = new Date(year, 0, 1)
  const breakdownStart = new Date(year - 1, now.getMonth() + 1, 1)
  const weekStart = new Date(year, now.getMonth(), now.getDate() - 6)
  weekStart.setHours(0, 0, 0, 0)

  const [tenant, monthByTypeAndCategory, yearIncomeAgg, monthlyRaw, weeklyRaw, recentTx, activeClients] = await Promise.all([
    prisma.tenant.findUnique({
      where: { cnpj },
      select: { id: true, razaoSocial: true, nomeFantasia: true, cnpj: true },
    }),
    prisma.transaction.groupBy({
      by: ['type', 'category'],
      where: { tenant: { cnpj }, date: { gte: monthStart, lte: monthEnd } },
      _sum: { amount: true },
    }),
    prisma.transaction.aggregate({
      where: { tenant: { cnpj }, date: { gte: yearStart }, type: TransactionType.INCOME },
      _sum: { amount: true },
    }),
    prisma.$queryRaw<{ month: Date; type: string; total: number }[]>`
      SELECT
        DATE_TRUNC('month', date) AS month,
        type,
        SUM(amount)::float8       AS total
      FROM transactions
      WHERE "tenantId" = (SELECT id FROM tenants WHERE cnpj = ${cnpj})
        AND date >= ${breakdownStart}
        AND date <= ${monthEnd}
      GROUP BY DATE_TRUNC('month', date), type
      ORDER BY month
    `,
    prisma.$queryRaw<{ day: Date; type: string; total: number }[]>`
      SELECT
        DATE_TRUNC('day', date) AS day,
        type,
        SUM(amount)::float8     AS total
      FROM transactions
      WHERE "tenantId" = (SELECT id FROM tenants WHERE cnpj = ${cnpj})
        AND date >= ${weekStart}
      GROUP BY DATE_TRUNC('day', date), type
      ORDER BY day
    `,
    prisma.transaction.findMany({
      where: { tenant: { cnpj } },
      orderBy: { date: 'desc' },
      take: 10,
      select: { id: true, description: true, amount: true, type: true, category: true, date: true, aiCategorized: true, notes: true },
    }),
    prisma.client.count({ where: { tenant: { cnpj } } }),
  ])

  if (!tenant) throw new Error('Tenant not found')

  let monthIncome = 0
  let monthExpense = 0
  const expenseCategories: Record<string, number> = {}

  for (const row of monthByTypeAndCategory) {
    const amt = Number(row._sum.amount ?? 0)
    if (row.type === TransactionType.INCOME) {
      monthIncome += amt
    } else {
      monthExpense += amt
      expenseCategories[row.category] = (expenseCategories[row.category] ?? 0) + amt
    }
  }

  const yearIncome = Number(yearIncomeAgg._sum.amount ?? 0)

  const monthlyBreakdown: { month: string; label: string; income: number; expense: number }[] = []
  for (let i = 12; i >= 0; i--) {
    const d = new Date(year, now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const incRow = monthlyRaw.find(r => {
      const rd = new Date(r.month)
      return `${rd.getFullYear()}-${String(rd.getMonth() + 1).padStart(2, '0')}` === key && r.type === 'INCOME'
    })
    const expRow = monthlyRaw.find(r => {
      const rd = new Date(r.month)
      return `${rd.getFullYear()}-${String(rd.getMonth() + 1).padStart(2, '0')}` === key && r.type === 'EXPENSE'
    })
    monthlyBreakdown.push({
      month: d.toLocaleDateString('pt-BR', { month: 'short' }),
      label: d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
      income: Number(incRow?.total ?? 0),
      expense: Number(expRow?.total ?? 0),
    })
  }

  const weeklyBreakdown: { day: string; income: number; expense: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(year, now.getMonth(), now.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    const incRow = weeklyRaw.find(r => new Date(r.day).toISOString().slice(0, 10) === key && r.type === 'INCOME')
    const expRow = weeklyRaw.find(r => new Date(r.day).toISOString().slice(0, 10) === key && r.type === 'EXPENSE')
    weeklyBreakdown.push({
      day: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
      income: Number(incRow?.total ?? 0),
      expense: Number(expRow?.total ?? 0),
    })
  }

  return {
    tenantName: tenant.nomeFantasia ?? tenant.razaoSocial,
    tenantCNPJ: tenant.cnpj,
    monthIncome,
    monthExpense,
    monthProfit: monthIncome - monthExpense,
    yearIncome,
    limitPct: (yearIncome / MEI_ANNUAL_LIMIT) * 100,
    limitRemaining: MEI_ANNUAL_LIMIT - yearIncome,
    activeClients,
    monthlyBreakdown,
    weeklyBreakdown,
    expenseCategories,
    recentTransactions: recentTx.map(t => ({
      id: t.id,
      description: t.description,
      amount: t.amount,
      type: t.type as 'INCOME' | 'EXPENSE',
      category: t.category,
      date: t.date.toISOString(),
      aiCategorized: t.aiCategorized,
      notes: t.notes,
    })),
  }
}

export function getDashboardData(cnpj: string): Promise<DashboardData> {
  return unstable_cache(() => _getDashboardData(cnpj), [`dashboard-data-${cnpj}`], {
    revalidate: 30,
    tags: ['dashboard'],
  })()
}
