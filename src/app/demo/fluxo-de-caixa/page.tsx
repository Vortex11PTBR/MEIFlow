import { getDashboardData } from '@/lib/dashboard'
import { formatCurrency } from '@/lib/utils'
import { RevenueChart } from '@/components/dashboard/RevenueChart'

export const dynamic = 'force-dynamic'

export default async function FluxoCaixaPage() {
  let data
  try {
    data = await getDashboardData()
  } catch {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm">Banco de dados não configurado.</p>
      </div>
    )
  }

  const saldo = data.monthIncome - data.monthExpense
  const projecaoAnual = saldo * 12

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="animate-fade-in-up">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Financeiro</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Fluxo de Caixa</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Acompanhe entradas e saídas do seu negócio</p>
      </div>

      {/* Saldo do mês */}
      <div className={`rounded-2xl p-6 border shadow-sm animate-fade-in-up ${
        saldo >= 0
          ? 'bg-green-50 dark:bg-green-400/5 border-green-200 dark:border-green-400/20'
          : 'bg-red-50 dark:bg-red-400/5 border-red-200 dark:border-red-400/20'
      }`}>
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">Resultado do Mês Atual</p>
        <p className={`font-mono text-4xl font-bold tabular-nums ${saldo >= 0 ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
          {saldo >= 0 ? '+' : ''}{formatCurrency(saldo)}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
          {saldo >= 0 ? 'Seu negócio está no positivo este mês.' : 'Atenção: suas despesas superaram as receitas este mês.'}
        </p>
      </div>

      {/* 3 cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger animate-fade-in-up">
        <div className="bg-white dark:bg-slate-800 border border-green-200 dark:border-green-400/20 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Entradas</p>
          <p className="font-mono text-2xl font-bold text-green-600 dark:text-green-400 tabular-nums">{formatCurrency(data.monthIncome)}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">este mês</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-red-200 dark:border-red-400/20 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Total Saídas</p>
          <p className="font-mono text-2xl font-bold text-red-600 dark:text-red-400 tabular-nums">{formatCurrency(data.monthExpense)}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">este mês</p>
        </div>
        <div className="bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-400/20 rounded-2xl p-5 shadow-sm">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Projeção Anual</p>
          <p className="font-mono text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">{formatCurrency(projecaoAnual)}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">se mantiver este ritmo</p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm animate-fade-in-up">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Entradas vs Saídas — Últimos 5 meses</p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-600" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Entradas</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
              <span className="text-xs text-slate-500 dark:text-slate-400">Saídas</span>
            </div>
          </div>
        </div>
        <div className="h-56">
          <RevenueChart data={data.monthlyBreakdown} />
        </div>
      </div>

      {/* Dicas */}
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm animate-fade-in-up">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Como melhorar seu fluxo de caixa</p>
        <div className="space-y-3">
          {[
            { title: 'Registre tudo imediatamente', desc: 'Cada entrada e saída deve ser registrada no mesmo dia para ter controle real.' },
            { title: 'Separe uma reserva de emergência', desc: 'Guarde pelo menos 3 meses de despesas fixas em conta separada.' },
            { title: 'Negocie prazos com fornecedores', desc: 'Alinhe as datas de pagamento ao seu ciclo de recebimento.' },
            { title: 'Fique de olho no limite anual', desc: 'MEI pode faturar até R$ 81.000/ano. Acompanhe pelo painel principal.' },
          ].map((tip, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-400/10 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300">{i + 1}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{tip.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
