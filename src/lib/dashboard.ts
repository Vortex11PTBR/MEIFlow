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
  monthlyBreakdown: { month: string; income: number; expense: number }[]
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

export async function getDashboardData(): Promise<DashboardData> {
  const tenant = await prisma.tenant.findUnique({
    where: { cnpj: DEMO_TENANT_CNPJ },
    include: { transactions: { orderBy: { date: 'desc' } } },
  })

  if (!tenant) throw new Error('Demo tenant not found — run: npm run db:seed')

  const now = new Date()
  const year = now.getFullYear()
  const monthStart = new Date(year, now.getMonth(), 1)
  const monthEnd = new Date(year, now.getMonth() + 1, 0, 23, 59, 59)
  const yearStart = new Date(year, 0, 1)

  const monthTx = tenant.transactions.filter(t => t.date >= monthStart && t.date <= monthEnd)
  const yearTx = tenant.transactions.filter(t => t.date >= yearStart)

  const monthIncome = monthTx
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((s, t) => s + t.amount, 0)
  const monthExpense = monthTx
    .filter(t => t.type === TransactionType.EXPENSE)
    .reduce((s, t) => s + t.amount, 0)
  const yearIncome = yearTx
    .filter(t => t.type === TransactionType.INCOME)
    .reduce((s, t) => s + t.amount, 0)

  // Monthly breakdown (last 5 months)
  const monthlyBreakdown: { month: string; income: number; expense: number }[] = []
  for (let i = 4; i >= 0; i--) {
    const d = new Date(year, now.getMonth() - i, 1)
    const end = new Date(year, now.getMonth() - i + 1, 0, 23, 59, 59)
    const txs = tenant.transactions.filter(t => t.date >= d && t.date <= end)
    monthlyBreakdown.push({
      month: d.toLocaleDateString('pt-BR', { month: 'short' }),
      income: txs.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0),
      expense: txs.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0),
    })
  }

  // Last 7 days breakdown
  const weeklyBreakdown: { day: string; income: number; expense: number }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i)
    const nextDay = new Date(d.getTime() + 86400000)
    const txs = tenant.transactions.filter(t => t.date >= d && t.date < nextDay)
    weeklyBreakdown.push({
      day: d.toLocaleDateString('pt-BR', { weekday: 'short' }),
      income: txs.filter(t => t.type === TransactionType.INCOME).reduce((s, t) => s + t.amount, 0),
      expense: txs.filter(t => t.type === TransactionType.EXPENSE).reduce((s, t) => s + t.amount, 0),
    })
  }

  // Expense categories this month
  const expenseCategories: Record<string, number> = {}
  monthTx
    .filter(t => t.type === TransactionType.EXPENSE)
    .forEach(t => {
      expenseCategories[t.category] = (expenseCategories[t.category] ?? 0) + t.amount
    })

  const activeClients = await prisma.client.count({ where: { tenantId: tenant.id } })

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
    recentTransactions: tenant.transactions.slice(0, 10).map(t => ({
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
