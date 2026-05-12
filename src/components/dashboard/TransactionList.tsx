import { formatCurrency } from '@/lib/utils'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  category: string
  date: string
  aiCategorized: boolean
}

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

export function TransactionList({ transactions }: { transactions: Transaction[] }) {
  return (
    <div className="bg-white/[0.028] border border-white/[0.07] rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[11px] text-slate-400 uppercase tracking-widest">Lançamentos recentes</p>
        <span className="font-mono text-[10px] text-purple-400 border border-purple-400/30 bg-purple-400/10 px-2 py-0.5 rounded-full">
          ✦ categorizado por IA
        </span>
      </div>
      <div className="space-y-1">
        {transactions.map(tx => (
          <div
            key={tx.id}
            className="grid grid-cols-[32px_1fr_auto] items-center gap-3 px-2 py-2 rounded-lg hover:bg-white/[0.03] transition-colors"
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm ${
                tx.type === 'INCOME' ? 'bg-green-400/10' : 'bg-red-400/10'
              }`}
            >
              {tx.type === 'INCOME' ? '💰' : '🔴'}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-200 truncate max-w-[200px]">{tx.description}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                {tx.aiCategorized && <span className="font-mono text-[9px] text-purple-400">AI →</span>}
                <span
                  className={`font-mono text-[9px] px-1.5 py-0.5 rounded-full border ${
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
                  tx.type === 'INCOME' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {tx.type === 'INCOME' ? '+' : '−'}{formatCurrency(tx.amount)}
              </p>
              <p className="font-mono text-[10px] text-slate-500">
                {new Date(tx.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
