import { formatCurrency, MEI_ANNUAL_LIMIT } from '@/lib/utils'

interface Props {
  yearIncome: number
  limitPct: number
  limitRemaining: number
}

export function LimitBar({ yearIncome, limitPct, limitRemaining }: Props) {
  const pct = Math.min(limitPct, 100)
  const color = pct >= 90 ? 'from-red-500 to-red-400' : pct >= 75 ? 'from-amber-500 to-amber-400' : 'from-green-500 to-cyan-400'

  return (
    <div className="bg-white/[0.028] border border-white/[0.07] rounded-xl p-5">
      <div className="flex justify-between items-start mb-3">
        <div>
          <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest">Limite anual MEI · Receita Federal</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg font-bold text-amber-400">{formatCurrency(yearIncome)}</p>
          <p className="font-mono text-[10px] text-slate-500">de {formatCurrency(MEI_ANNUAL_LIMIT)}</p>
        </div>
      </div>
      <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden mb-2">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-1000`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="font-mono text-[10px] text-slate-500">
        {pct >= 80 ? '⚠ ' : ''}
        {pct.toFixed(1)}% utilizado — {formatCurrency(limitRemaining)} restante.
        {pct >= 80 && ' Considere formalizar como Microempresa.'}
      </p>
    </div>
  )
}
