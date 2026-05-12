import { getDashboardData } from '@/lib/dashboard'
import { LimitBar } from '@/components/dashboard/LimitBar'
import { ExpenseChart } from '@/components/dashboard/ExpenseChart'
import { LineChart } from '@/components/dashboard/LineChart'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface PageProps {
  searchParams?: { period?: string }
}

export default async function RelatoriosPage({ searchParams }: PageProps) {
  let data
  try {
    data = await getDashboardData()
  } catch {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="font-mono text-slate-400 text-sm">🗄 Banco de dados não configurado.</p>
      </div>
    )
  }

  const period = searchParams?.period ?? 'month'
  const chartData = period === 'week' ? data.weeklyBreakdown : data.monthlyBreakdown

  const totalYearIncome = data.monthlyBreakdown.reduce((s, m) => s + m.income, 0)
  const totalYearExpense = data.monthlyBreakdown.reduce((s, m) => s + m.expense, 0)
  const avgMonthlyIncome = data.monthlyBreakdown.length
    ? totalYearIncome / data.monthlyBreakdown.length
    : 0
  const bestMonth = data.monthlyBreakdown.reduce(
    (best, m) => (m.income > best.income ? m : best),
    data.monthlyBreakdown[0] ?? { month: '—', income: 0, expense: 0 }
  )

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.12em] mb-1">Análise</p>
        <h1 className="text-xl font-bold text-slate-100">Relatórios</h1>
      </div>

      {/* Period tabs */}
      <div className="flex gap-2 animate-fade-in-up">
        {(['week', 'month'] as const).map(p => (
          <Link
            key={p}
            href={`/demo/relatorios?period=${p}`}
            className={`font-mono text-xs px-4 py-2 rounded-lg border transition-all ${
              period === p
                ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400'
                : 'border-white/[0.07] text-slate-500 hover:text-slate-300 hover:border-white/20'
            }`}
          >
            {p === 'week' ? 'Esta semana' : 'Este mês'}
          </Link>
        ))}
      </div>

      {/* Line chart — tendência */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.12em]">Tendência de Receita</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              <span className="font-mono text-[10px] text-slate-500">Receita</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
              <span className="font-mono text-[10px] text-slate-500">Despesa</span>
            </div>
          </div>
        </div>
        <div className="h-56">
          <LineChart data={chartData} />
        </div>
      </div>

      {/* Two column: expense chart + limit bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in-up">
        <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
          <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.12em] mb-5">Distribuição por Categoria</p>
          <div className="h-48">
            <ExpenseChart data={data.expenseCategories} />
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <LimitBar
            yearIncome={data.yearIncome}
            limitPct={data.limitPct}
            limitRemaining={data.limitRemaining}
          />
        </div>
      </div>

      {/* Annual summary cards */}
      <div className="animate-fade-in-up">
        <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.12em] mb-3">Resumo do Período</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 stagger">
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-green-400/20 transition-all">
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.12em] mb-3">Total Receitas</p>
            <p className="font-mono text-2xl font-bold text-green-400 tabular-nums">{formatCurrency(totalYearIncome)}</p>
            <p className="font-mono text-[10px] text-slate-600 mt-2">últimos 5 meses</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-cyan-400/20 transition-all">
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.12em] mb-3">Média Mensal</p>
            <p className="font-mono text-2xl font-bold text-cyan-400 tabular-nums">{formatCurrency(avgMonthlyIncome)}</p>
            <p className="font-mono text-[10px] text-slate-600 mt-2">receita média</p>
          </div>
          <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5 hover:border-amber-400/20 transition-all">
            <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.12em] mb-3">Melhor Mês</p>
            <p className="font-mono text-2xl font-bold text-amber-400 tabular-nums">{formatCurrency(bestMonth?.income ?? 0)}</p>
            <p className="font-mono text-[10px] text-slate-600 mt-2 capitalize">{bestMonth?.month ?? '—'}</p>
          </div>
        </div>
      </div>

      {/* Monthly breakdown table */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden animate-fade-in-up">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.12em]">Evolução Mensal</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/[0.04]">
                {['Mês', 'Receita', 'Despesa', 'Resultado'].map(h => (
                  <th key={h} className="px-5 py-3 text-left font-mono text-[9px] text-slate-500 uppercase tracking-[0.12em]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...data.monthlyBreakdown].reverse().map((m, i) => {
                const res = m.income - m.expense
                return (
                  <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3 font-mono text-xs text-slate-300 capitalize">{m.month}</td>
                    <td className="px-5 py-3 font-mono text-xs text-green-400 tabular-nums">+{formatCurrency(m.income)}</td>
                    <td className="px-5 py-3 font-mono text-xs text-red-400 tabular-nums">−{formatCurrency(m.expense)}</td>
                    <td className={`px-5 py-3 font-mono text-xs font-semibold tabular-nums ${res >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
                      {res >= 0 ? '+' : '−'}{formatCurrency(Math.abs(res))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
