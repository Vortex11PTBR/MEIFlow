import { getDashboardData } from '@/lib/dashboard'
import { LimitBar } from '@/components/dashboard/LimitBar'
import { DASCard } from '@/components/dashboard/DASCard'
import { TransactionList } from '@/components/dashboard/TransactionList'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { ExpenseChart } from '@/components/dashboard/ExpenseChart'
import { AddTransaction } from '@/components/AddTransaction'
import { ExportButton } from '@/components/ExportButton'
import { formatCurrency } from '@/lib/utils'

export const revalidate = 30

export default async function DemoPage() {
  let data
  try {
    data = await getDashboardData()
  } catch {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm">Banco de dados não configurado.</p>
        <p className="text-xs text-slate-400 mt-2">
          Execute: <code className="text-blue-600 dark:text-blue-400 font-mono">npm run db:push && npm run db:seed</code>
        </p>
      </div>
    )
  }

  const kpis = [
    {
      label: 'Receita do Mês',
      value: data.monthIncome,
      color: 'text-green-600 dark:text-green-400',
      border: 'border-green-200 dark:border-green-400/20',
      delta: '+12% vs mês ant.',
      deltaUp: true,
    },
    {
      label: 'Despesas do Mês',
      value: data.monthExpense,
      color: 'text-red-600 dark:text-red-400',
      border: 'border-red-200 dark:border-red-400/20',
      delta: '-4% vs mês ant.',
      deltaUp: false,
    },
    {
      label: 'Lucro Líquido',
      value: data.monthProfit,
      color: data.monthProfit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400',
      border: 'border-blue-200 dark:border-blue-400/20',
      delta: data.monthProfit >= 0 ? 'Resultado positivo ✓' : 'Atenção: negativo',
      deltaUp: data.monthProfit >= 0,
    },
    {
      label: 'Clientes Ativos',
      value: data.activeClients,
      color: 'text-amber-600 dark:text-amber-400',
      border: 'border-amber-200 dark:border-amber-400/20',
      isCurrency: false,
      delta: 'clientes cadastrados',
      deltaUp: true,
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Painel · {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{data.tenantName}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5 font-mono">
            {data.tenantCNPJ.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton transactions={data.recentTransactions} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 stagger animate-fade-in-up">
        {kpis.map(kpi => (
          <div
            key={kpi.label}
            className={`bg-white dark:bg-slate-800 border ${kpi.border} rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200`}
          >
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-3">{kpi.label}</p>
            <p className={`font-mono text-2xl font-bold tabular-nums ${kpi.color}`}>
              {kpi.isCurrency === false
                ? kpi.value.toLocaleString('pt-BR')
                : formatCurrency(kpi.value)}
            </p>
            {kpi.delta && (
              <p className={`text-xs mt-2 ${kpi.deltaUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {kpi.delta}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Limit Bar + DAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in-up">
        <LimitBar yearIncome={data.yearIncome} limitPct={data.limitPct} limitRemaining={data.limitRemaining} />
        <DASCard />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 animate-fade-in-up">
        <div className="lg:col-span-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Receita vs Despesas</p>
            <span className="text-xs text-slate-400 bg-slate-100 dark:bg-slate-700 px-2.5 py-1 rounded-full">Últimos 5 meses</span>
          </div>
          <div className="h-52">
            <RevenueChart data={data.monthlyBreakdown} />
          </div>
        </div>
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-5">Despesas por Categoria</p>
          <div className="h-52">
            <ExpenseChart data={data.expenseCategories} />
          </div>
        </div>
      </div>

      {/* Add Transaction + Recent */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in-up">
        <AddTransaction />
        <TransactionList transactions={data.recentTransactions} />
      </div>

      {/* Footer note */}
      <div className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
        <p className="text-xs text-slate-400 text-center">
          Dados de demonstração · Next.js 14 · Prisma · Neon · Claude AI ·{' '}
          <a href="https://github.com/Vortex11PTBR/MEIFlow" className="text-blue-600 dark:text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
            github.com/Vortex11PTBR/MEIFlow
          </a>
        </p>
      </div>
    </div>
  )
}
