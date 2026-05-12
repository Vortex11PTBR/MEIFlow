import { unstable_cache } from 'next/cache'
import { prisma } from './db'
import { MEI_ANNUAL_LIMIT, DEMO_TENANT_CNPJ } from './utils'
import { TransactionType } from '@prisma/client'

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

async function _getDashboardData(): Promise<DashboardData> {
  const now = new Date()
  const year = now.getFullYear()
  const monthStart = new Date(year, now.getMonth(), 1)
  const monthEnd = new Date(year, now.getMonth() + 1, 0, 23, 59, 59)
  const yearStart = new Date(year, 0, 1)
  // Fetch last 13 months for monthly breakdown
  const breakdownStart = new Date(year - 1, now.getMonth() + 1, 1)
  const weekStart = new Date(year, now.getMonth(), now.getDate() - 6)

  const [tenant, monthTx, yearIncomeTx, breakdownTx, weekTx, recentTx, activeClients] =
    await Promise.all([
      prisma.tenant.findUnique({ where: { cnpj: DEMO_TENANT_CNPJ }, select: { id: true, razaoSocial: true, nomeFantasia: true, cnpj: true } }),
      prisma.transaction.findMany({
        where: { tenant: { cnpj: DEMO_TENANT_CNPJ }, date: { gte: monthStart, lte: monthEnd } },
        select: { type: true, amount: true, category: true },
      }),
      prisma.transaction.findMany({
        where: { tenant: { cnpj: DEMO_TENANT_CNPJ }, date: { gte: yearStart }, type: TransactionType.INCOME },
        select: { amount: true },
      }),
      prisma.transaction.findMany({
        where: { tenant: { cnpj: DEMO_TENANT_CNPJ }, date: { gte: breakdownStart, lte: monthEnd } },
        select: { type: true, amount: true, date: true },
      }),
      prisma.transaction.findMany({
        where: { tenant: { cnpj: DEMO_TENANT_CNPJ }, date: { gte: weekStart } },
        select: { type: true, amount: true, date: true },
      }),
      prisma.transaction.findMany({
        where: { tenant: { cnpj: DEMO_TENANT_CNPJ } },
        orderBy: { date: 'desc' },
        take: 10,
        select: { id: true, description: true, amount: true, type: true, category: true, date: true, aiCategorized: true, notes: true },
      }),
      prisma.client.count({ where: { tenant: { cnpj: DEMO_TENANT_CNPJ } } }),
    ])

  if (!tenant) throw new Error('Demo tenant not found — run: npm run db:seed')

  const monthIncome = monthTx.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0)
  const monthExpense = monthTx.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0)
  const yearIncome = yearIncomeTx.reduce((s, t) => s + t.amount, 0)

  // Monthly breakdown — last 13 months
  const monthlyBreakdown: { month: string; label: string; income: number; expense: number }[] = []
  for (let i = 12; i >= 0; i--) {
    const d = new Date(year, now.getMonth() - i, 1)
    const end = new Date(year, now.getMonth() - i + 1, 0, 23, 59, 59)
    const txs = breakdownTx.filter(t => t.date >= d && t.date <= end)
    monthlyBreakdown.push({
      month: d.toLocaleDateString('pt-BR', { month: 'short' }),
      label: d.toLocaleDateString('pt-BR', { month: 'short', year: '2-digit' }),
      income: txs.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0),
      expense: txs.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0),
    })
  }

  // Last 7 days
  const weeklyBreakdown: { day: string; income: number; expense: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(year, now.getMonth(), now.getDate() - i)
    const nextDay = new Date(d.getTime() + 86400000)
    const txs = weekTx.filter(t => t.date >= d && t.date < nextDay)
    weeklyBreakdown.push({
      day: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
      income: txs.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0),
      expense: txs.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0),
    })
  }

  // Expense categories this month
  const expenseCategories: Record<string, number> = {}
  monthTx.filter(t => t.type === TransactionType.EXPENSE).forEach(t => {
    expenseCategories[t.category] = (expenseCategories[t.category] ?? 0) + t.amount
  })

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

export const getDashboardData = unstable_cache(
  _getDashboardData,
  ['dashboard-data'],
  { revalidate: 30, tags: ['dashboard'] }
)
