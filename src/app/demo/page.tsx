import { getDashboardData } from '@/lib/dashboard'
import { LimitBar } from '@/components/dashboard/LimitBar'
import { DASCard } from '@/components/dashboard/DASCard'
import { TransactionList } from '@/components/dashboard/TransactionList'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { ExpenseChart } from '@/components/dashboard/ExpenseChart'
import { AddTransaction } from '@/components/AddTransaction'
import { ExportButton } from '@/components/ExportButton'
import { formatCurrency } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function DemoPage() {
  let data
  try {
    data = await getDashboardData()
  } catch {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="font-mono text-slate-400 text-sm">🗄 Banco de dados não configurado.</p>
        <p className="font-mono text-xs text-slate-600 mt-2">
          Execute: <code className="text-cyan-400">npm run db:push && npm run db:seed</code>
        </p>
      </div>
    )
  }

  const kpis = [
    {
      label: 'Receita do Mês',
      value: data.monthIncome,
      color: 'text-green-400',
      border: 'hover:border-green-400/20',
      delta: '+12%',
      deltaUp: true,
    },
    {
      label: 'Despesa do Mês',
      value: data.monthExpense,
      color: 'text-red-400',
      border: 'hover:border-red-400/20',
      delta: '-4%',
      deltaUp: false,
    },
    {
      label: 'Lucro Líquido',
      value: data.monthProfit,
      color: data.monthProfit >= 0 ? 'text-cyan-400' : 'text-red-400',
      border: 'hover:border-cyan-400/20',
      delta: data.monthProfit >= 0 ? '+saudável' : 'atenção',
      deltaUp: data.monthProfit >= 0,
    },
    {
      label: 'Clientes Ativos',
      value: data.activeClients,
      color: 'text-amber-400',
      border: 'hover:border-amber-400/20',
      isCurrency: false,
      delta: 'cadastrados',
      deltaUp: true,
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
        <div>
          <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.12em] mb-1">Painel · {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
          <h1 className="text-xl font-bold text-slate-100">{data.tenantName}</h1>
          <p className="font-mono text-xs text-slate-500 mt-0.5">
            {data.tenantCNPJ.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ExportButton transactions={data.recentTransactions} />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger animate-fade-in-up">
        {kpis.map(kpi => (
          <div
            key={kpi.label}
            className={`bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 ${kpi.border} hover:bg-white/[0.05] transition-all duration-200`}
          >
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.12em] mb-3">{kpi.label}</p>
            <p className={`font-mono text-2xl font-bold tabular-nums ${kpi.color}`}>
              {kpi.isCurrency === false
                ? kpi.value.toLocaleString('pt-BR')
                : formatCurrency(kpi.value)}
            </p>
            {kpi.delta && (
              <p className={`font-mono text-[10px] mt-2 ${kpi.deltaUp ? 'text-green-400' : 'text-red-400'}`}>
                {kpi.deltaUp ? '↑' : '↓'} {kpi.delta}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Limit Bar + DAS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in-up">
        <LimitBar
          yearIncome={data.yearIncome}
          limitPct={data.limitPct}
          limitRemaining={data.limitRemaining}
        />
        <DASCard />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 animate-fade-in-up">
        <div className="lg:col-span-3 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-200">
          <div className="flex items-center justify-between mb-5">
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.12em]">Receita vs Despesa</p>
            <span className="font-mono text-[9px] text-slate-600 border border-white/[0.06] px-2 py-0.5 rounded-full">últimos 5 meses</span>
          </div>
          <div className="h-52">
            <RevenueChart data={data.monthlyBreakdown} />
          </div>
        </div>
        <div className="lg:col-span-2 bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-white/[0.12] transition-all duration-200">
          <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.12em] mb-5">Despesas por Categoria</p>
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
      <div className="p-4 bg-white/[0.015] border border-white/[0.05] rounded-xl">
        <p className="font-mono text-[10px] text-slate-600 text-center">
          ✦ Dados de demonstração · Next.js 14 · Prisma · Neon · Claude AI ·{' '}
          <a href="https://github.com/Vortex11PTBR/MEIFlow" className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">
            github.com/Vortex11PTBR/MEIFlow
          </a>
        </p>
      </div>
    </div>
  )
}
