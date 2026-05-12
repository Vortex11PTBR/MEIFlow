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
        <p className="text-slate-500 dark:text-slate-400 text-sm">🗄 Banco de dados não configurado.</p>
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
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Análise</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Relatórios</h1>
      </div>

      {/* Period tabs */}
      <div className="flex gap-2 animate-fade-in-up">
        {(['week', 'month'] as const).map(p => (
          <Link
            key={p}
            href={`/demo/relatorios?period=${p}`}
            className={`text-xs px-4 py-2 rounded-lg border transition-all font-medium ${
              period === p
                ? 'bg-blue-50 dark:bg-blue-400/10 border-blue-300 dark:border-blue-400/30 text-blue-700 dark:text-blue-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300'
            }`}
          >
            {p === 'week' ? 'Esta semana' : 'Este mês'}
          </Link>
        ))}
      </div>

      {/* Line chart — tendência */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Tendência de Receita</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-600 dark:bg-green-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Receita</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 dark:bg-red-400" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Despesa</span>
            </div>
          </div>
        </div>
        <div className="h-56">
          <LineChart data={chartData} />
        </div>
      </div>

      {/* Two column: expense chart + limit bar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 animate-fade-in-up">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-5">Distribuição por Categoria</p>
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
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Resumo do Período</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 stagger">
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Total Receitas</p>
            <p className="font-mono text-2xl font-bold text-green-600 dark:text-green-400 tabular-nums">{formatCurrency(totalYearIncome)}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">últimos 5 meses</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Média Mensal</p>
            <p className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">{formatCurrency(avgMonthlyIncome)}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">receita média</p>
          </div>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Melhor Mês</p>
            <p className="font-mono text-2xl font-bold text-amber-600 dark:text-amber-400 tabular-nums">{formatCurrency(bestMonth?.income ?? 0)}</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 capitalize">{bestMonth?.month ?? '—'}</p>
          </div>
        </div>
      </div>

      {/* Monthly breakdown table */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm animate-fade-in-up">
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-700">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Evolução Mensal</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-700/50">
                {['Mês', 'Receita', 'Despesa', 'Resultado'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[...data.monthlyBreakdown].reverse().map((m, i) => {
                const res = m.income - m.expense
                return (
                  <tr key={i} className="border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-5 py-3 text-sm text-slate-700 dark:text-slate-300 capitalize font-medium">{m.month}</td>
                    <td className="px-5 py-3 font-mono text-sm text-green-600 dark:text-green-400 tabular-nums">+{formatCurrency(m.income)}</td>
                    <td className="px-5 py-3 font-mono text-sm text-red-600 dark:text-red-400 tabular-nums">−{formatCurrency(m.expense)}</td>
                    <td className={`px-5 py-3 font-mono text-sm font-semibold tabular-nums ${res >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
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
