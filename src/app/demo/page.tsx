import { getDashboardData } from '@/lib/dashboard'
import { KPIRow } from '@/components/dashboard/KPIRow'
import { LimitBar } from '@/components/dashboard/LimitBar'
import { DASCard } from '@/components/dashboard/DASCard'
import { TransactionList } from '@/components/dashboard/TransactionList'
import { RevenueChart } from '@/components/dashboard/RevenueChart'
import { ExpenseChart } from '@/components/dashboard/ExpenseChart'
import { AddTransaction } from '@/components/AddTransaction'

export const dynamic = 'force-dynamic'

export default async function DemoPage() {
  let data
  try {
    data = await getDashboardData()
  } catch {
    return (
      <main className="max-w-6xl mx-auto px-6 py-20 text-center">
        <p className="font-mono text-slate-400 text-sm">
          🗄 Banco de dados não configurado.
        </p>
        <p className="font-mono text-xs text-slate-600 mt-2">
          Execute: <code className="text-cyan-400">npm run db:push && npm run db:seed</code>
        </p>
      </main>
    )
  }

  const kpis = [
    { label: 'Receita (mês)', value: data.monthIncome, isCurrency: true, color: 'green' as const },
    { label: 'Despesa (mês)', value: data.monthExpense, isCurrency: true, color: 'red' as const },
    {
      label: 'Lucro (mês)',
      value: data.monthProfit,
      isCurrency: true,
      color: (data.monthProfit >= 0 ? 'cyan' : 'red') as 'cyan' | 'red',
    },
    { label: 'Clientes ativos', value: data.activeClients, isCurrency: false, color: 'amber' as const },
  ]

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="font-mono text-[10px] text-green-400 uppercase tracking-widest">Demo ao vivo</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100">{data.tenantName}</h1>
          <p className="font-mono text-xs text-slate-500 mt-1">
            CNPJ {data.tenantCNPJ.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')}
          </p>
        </div>
        <div className="font-mono text-[11px] text-slate-600 border border-white/[0.06] bg-white/[0.02] rounded-lg px-3 py-2">
          Dados de demonstração · tenant isDemo
        </div>
      </div>

      <KPIRow kpis={kpis} />

      <LimitBar
        yearIncome={data.yearIncome}
        limitPct={data.limitPct}
        limitRemaining={data.limitRemaining}
      />
      <DASCard />

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3 bg-white/[0.028] border border-white/[0.07] rounded-xl p-5">
          <p className="font-mono text-[11px] text-slate-400 uppercase tracking-widest mb-4">
            Receita vs Despesa — últimos 5 meses
          </p>
          <div className="h-56">
            <RevenueChart data={data.monthlyBreakdown} />
          </div>
        </div>
        <div className="lg:col-span-2 bg-white/[0.028] border border-white/[0.07] rounded-xl p-5">
          <p className="font-mono text-[11px] text-slate-400 uppercase tracking-widest mb-4">
            Despesas por categoria
          </p>
          <div className="h-56">
            <ExpenseChart data={data.expenseCategories} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <AddTransaction />
        <TransactionList transactions={data.recentTransactions} />
      </div>

      <div className="p-4 bg-white/[0.015] border border-white/[0.05] rounded-xl">
        <p className="font-mono text-[10px] text-slate-600 text-center">
          ✦ Dados de demonstração · Construído por{' '}
          <a
            href="https://joaolacerda.dev"
            className="text-cyan-400 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            João Lacerda
          </a>{' '}
          · Next.js · Prisma · Neon · Claude AI · github.com/Vortex11PTBR/MEIFlow
        </p>
      </div>
    </main>
  )
}
