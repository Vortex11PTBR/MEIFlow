import { formatCurrency } from '@/lib/utils'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  category: string
  date: string
  aiCategorized: boolean
  notes?: string | null
}

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

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Lançamentos recentes</p>
        <span className="text-xs text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-400/30 bg-blue-50 dark:bg-blue-400/10 px-2 py-0.5 rounded-full">
          IA
        </span>
      </div>
      <div className="space-y-1">
        {transactions.map(tx => (
          <div
            key={tx.id}
            className="grid grid-cols-[32px_1fr_auto] items-start gap-3 px-2 py-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
          >
            {tx.type === 'INCOME' ? (
              <div className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-400/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
                </svg>
              </div>
            ) : (
              <div className="w-8 h-8 rounded-lg bg-red-100 dark:bg-red-400/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>
                </svg>
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-[200px]">{tx.description}</p>
              {tx.notes && (
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate max-w-[200px]" title={tx.notes}>
                  {tx.notes}
                </p>
              )}
              <div className="flex items-center gap-1.5 mt-0.5">
                {tx.aiCategorized && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 dark:bg-blue-400 shrink-0" />}
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full border ${
                    CATEGORY_COLORS[tx.category] ?? CATEGORY_COLORS['Outros']
                  }`}
                >
                  {tx.category}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p
                className={`font-mono text-sm font-semibold ${
                  tx.type === 'INCOME' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}
              >
                {tx.type === 'INCOME' ? '+' : '−'}{formatCurrency(tx.amount)}
              </p>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
