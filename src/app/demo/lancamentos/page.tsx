import Link from 'next/link'
import { prisma } from '@/lib/db'
import { DEMO_TENANT_CNPJ, formatCurrency } from '@/lib/utils'
import { ExportButton } from '@/components/ExportButton'

export const dynamic = 'force-dynamic'

const CATEGORY_COLORS: Record<string, string> = {
  Serviços: 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10',
  Marketing: 'text-purple-400 border-purple-400/30 bg-purple-400/10',
  Transporte: 'text-green-400 border-green-400/30 bg-green-400/10',
  Alimentação: 'text-amber-400 border-amber-400/30 bg-amber-400/10',
  Equipamento: 'text-sky-400 border-sky-400/30 bg-sky-400/10',
  Ferramentas: 'text-violet-400 border-violet-400/30 bg-violet-400/10',
  Educação: 'text-pink-400 border-pink-400/30 bg-pink-400/10',
  Infraestrutura: 'text-indigo-400 border-indigo-400/30 bg-indigo-400/10',
  Escritório: 'text-orange-400 border-orange-400/30 bg-orange-400/10',
  Impostos: 'text-red-400 border-red-400/30 bg-red-400/10',
  Manutenção: 'text-lime-400 border-lime-400/30 bg-lime-400/10',
  Saúde: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  Treinamento: 'text-teal-400 border-teal-400/30 bg-teal-400/10',
  Outros: 'text-slate-400 border-slate-400/30 bg-slate-400/10',
}

interface PageProps {
  searchParams?: { period?: string }
}

export default async function LancamentosPage({ searchParams }: PageProps) {
  const tenant = await prisma.tenant.findUnique({ where: { cnpj: DEMO_TENANT_CNPJ } })
  if (!tenant) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="font-mono text-slate-400 text-sm">🗄 Banco de dados não configurado.</p>
      </div>
    )
  }

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

  const totalIncome = filtered
    .filter(t => t.type === 'INCOME')
    .reduce((s, t) => s + t.amount, 0)
  const totalExpense = filtered
    .filter(t => t.type === 'EXPENSE')
    .reduce((s, t) => s + t.amount, 0)
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
        <div>
          <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.12em] mb-1">Histórico</p>
          <h1 className="text-xl font-bold text-slate-100">Lançamentos</h1>
        </div>
        <ExportButton transactions={exportData} />
      </div>

      {/* Period filter */}
      <div className="flex gap-2 animate-fade-in-up">
        {(['week', 'month', 'year'] as const).map(p => (
          <Link
            key={p}
            href={`/demo/lancamentos?period=${p}`}
            className={`font-mono text-xs px-4 py-2 rounded-lg border transition-all ${
              period === p
                ? 'bg-cyan-400/10 border-cyan-400/30 text-cyan-400'
                : 'border-white/[0.07] text-slate-500 hover:text-slate-300 hover:border-white/20'
            }`}
          >
            {PERIOD_LABELS[p]}
          </Link>
        ))}
        <span className="ml-auto font-mono text-[10px] text-slate-500 self-center">
          {filtered.length} {filtered.length === 1 ? 'lançamento' : 'lançamentos'}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden animate-fade-in-up">
        {filtered.length === 0 ? (
          <div className="py-16 text-center">
            <p className="font-mono text-slate-500 text-sm">Nenhum lançamento no período.</p>
            <p className="font-mono text-slate-600 text-xs mt-1">Selecione um período diferente ou adicione lançamentos.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor', 'Obs.'].map(h => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left font-mono text-[9px] text-slate-500 uppercase tracking-[0.12em]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((tx, i) => (
                  <tr
                    key={tx.id}
                    className={`border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors ${
                      i % 2 === 0 ? '' : 'bg-white/[0.01]'
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-xs text-slate-400 whitespace-nowrap">
                      {new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-slate-200 font-medium">{tx.description}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                          CATEGORY_COLORS[tx.category] ?? CATEGORY_COLORS['Outros']
                        }`}
                      >
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-mono text-[10px] px-2 py-0.5 rounded-full border ${
                          tx.type === 'INCOME'
                            ? 'text-green-400 border-green-400/30 bg-green-400/10'
                            : 'text-red-400 border-red-400/30 bg-red-400/10'
                        }`}
                      >
                        {tx.type === 'INCOME' ? 'Receita' : 'Despesa'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`font-mono text-sm font-semibold tabular-nums ${
                          tx.type === 'INCOME' ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        {tx.type === 'INCOME' ? '+' : '−'}{formatCurrency(tx.amount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {tx.notes ? (
                        <span title={tx.notes} className="text-slate-500 hover:text-slate-300 transition-colors cursor-help" aria-label={tx.notes}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                          </svg>
                        </span>
                      ) : (
                        <span className="text-white/[0.06]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-white/[0.02] border-t border-white/[0.08]">
                  <td colSpan={4} className="px-4 py-3 font-mono text-[10px] text-slate-500 uppercase tracking-wider">
                    Totais do período
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="space-y-0.5">
                      <div className="font-mono text-xs text-green-400 tabular-nums">+{formatCurrency(totalIncome)}</div>
                      <div className="font-mono text-xs text-red-400 tabular-nums">−{formatCurrency(totalExpense)}</div>
                      <div className={`font-mono text-sm font-bold tabular-nums ${resultado >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>
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
