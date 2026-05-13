import Link from 'next/link'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { ExportButton } from '@/components/ExportButton'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { formatCurrency } from '@/lib/utils'

export const revalidate = 30

const CATEGORY_COLORS: Record<string, string> = {
  Serviços: 'text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-400/30 bg-blue-50 dark:bg-blue-400/10',
  Marketing: 'text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-400/30 bg-purple-50 dark:bg-purple-400/10',
  Transporte: 'text-green-700 dark:text-green-300 border-green-200 dark:border-green-400/30 bg-green-50 dark:bg-green-400/10',
  Alimentação: 'text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-400/30 bg-amber-50 dark:bg-amber-400/10',
  Equipamento: 'text-sky-700 dark:text-sky-300 border-sky-200 dark:border-sky-400/30 bg-sky-50 dark:bg-sky-400/10',
  Ferramentas: 'text-violet-700 dark:text-violet-300 border-violet-200 dark:border-violet-400/30 bg-violet-50 dark:bg-violet-400/10',
  Educação: 'text-pink-700 dark:text-pink-300 border-pink-200 dark:border-pink-400/30 bg-pink-50 dark:bg-pink-400/10',
  Infraestrutura: 'text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-400/30 bg-indigo-50 dark:bg-indigo-400/10',
  Escritório: 'text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-400/30 bg-orange-50 dark:bg-orange-400/10',
  Impostos: 'text-red-700 dark:text-red-300 border-red-200 dark:border-red-400/30 bg-red-50 dark:bg-red-400/10',
  Manutenção: 'text-lime-700 dark:text-lime-300 border-lime-200 dark:border-lime-400/30 bg-lime-50 dark:bg-lime-400/10',
  Saúde: 'text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-400/30 bg-emerald-50 dark:bg-emerald-400/10',
  Treinamento: 'text-teal-700 dark:text-teal-300 border-teal-200 dark:border-teal-400/30 bg-teal-50 dark:bg-teal-400/10',
  Outros: 'text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-500/30 bg-slate-50 dark:bg-slate-400/10',
}

interface PageProps {
  searchParams?: { period?: string }
}

export default async function LancamentosPage({ searchParams }: PageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.tenantId) redirect('/onboarding')

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
    select: { id: true, cnpj: true },
  })

  if (!tenant) redirect('/onboarding')

  const transactions = await prisma.transaction.findMany({
    where: { tenantId: tenant.id },
    orderBy: { date: 'desc' },
  })

  const period = searchParams?.period ?? 'month'
  const now = new Date()
  let since: Date

  if (period === 'week') {
    since = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
  } else if (period === 'year') {
    since = new Date(now.getFullYear(), 0, 1)
  } else {
    since = new Date(now.getFullYear(), now.getMonth(), 1)
  }

  const filtered = transactions.filter(t => t.date >= since)
  const totalIncome = filtered.filter(t => t.type === 'INCOME').reduce((s, t) => s + t.amount, 0)
  const totalExpense = filtered.filter(t => t.type === 'EXPENSE').reduce((s, t) => s + t.amount, 0)
  const resultado = totalIncome - totalExpense

  const exportData = filtered.map(t => ({
    id: t.id,
    description: t.description,
    amount: t.amount,
    type: t.type as 'INCOME' | 'EXPENSE',
    category: t.category,
    date: t.date.toISOString(),
  }))

  const PERIOD_LABELS: Record<string, string> = {
    week: 'Esta semana',
    month: 'Este mês',
    year: 'Este ano',
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Histórico</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Lançamentos</h1>
        </div>
        <ExportButton transactions={exportData} />
      </div>

      <div className="flex gap-2 animate-fade-in-up">
        {(['week', 'month', 'year'] as const).map(p => (
          <Link
            key={p}
            href={`/app/lancamentos?period=${p}`}
            className={`text-xs px-4 py-2 rounded-lg border transition-all font-medium ${
              period === p
                ? 'bg-blue-50 dark:bg-blue-400/10 border-blue-300 dark:border-blue-400/30 text-blue-700 dark:text-blue-400'
                : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:border-slate-300'
            }`}
          >
            {PERIOD_LABELS[p]}
          </Link>
        ))}
        <span className="ml-auto text-xs text-slate-500 dark:text-slate-400 self-center">
          {filtered.length} {filtered.length === 1 ? 'lançamento' : 'lançamentos'}
        </span>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm animate-fade-in-up">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-slate-500 dark:text-slate-400 text-sm">Nenhum lançamento no período.</p>
            <p className="text-slate-400 dark:text-slate-500 text-xs mt-1">Selecione um período diferente ou adicione lançamentos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  {['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', 'Obs.'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx, i) => (
                  <tr
                    key={tx.id}
                    className={`border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${
                      i % 2 === 0 ? '' : 'bg-slate-50/50 dark:bg-slate-800/50'
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-800 dark:text-slate-200 font-medium">{tx.description}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[tx.category] ?? CATEGORY_COLORS.Outros}`}>
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          tx.type === 'INCOME'
                            ? 'text-green-700 dark:text-green-300 border-green-200 dark:border-green-400/30 bg-green-50 dark:bg-green-400/10'
                            : 'text-red-700 dark:text-red-300 border-red-200 dark:border-red-400/30 bg-red-50 dark:bg-red-400/10'
                        }`}
                      >
                        {tx.type === 'INCOME' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-mono text-sm font-semibold tabular-nums ${
                          tx.type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {tx.type === 'INCOME' ? '+' : '−'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-[180px]">
                      {tx.notes ? (
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{tx.notes}</p>
                      ) : (
                        <span className="text-slate-300 dark:text-slate-600 text-sm">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 dark:bg-slate-700/50 border-t border-slate-200 dark:border-slate-700">
                  <td colSpan={4} className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Totais do período
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="space-y-0.5">
                      <div className="font-mono text-xs text-green-600 dark:text-green-400 tabular-nums">+{formatCurrency(totalIncome)}</div>
                      <div className="font-mono text-xs text-red-600 dark:text-red-400 tabular-nums">−{formatCurrency(totalExpense)}</div>
                      <div className={`font-mono text-sm font-bold tabular-nums ${resultado >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-red-600 dark:text-red-400'}`}>
                        {resultado >= 0 ? '+' : '−'}{formatCurrency(Math.abs(resultado))}
                      </div>
                    </div>
                  </td>
                  <td />
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
