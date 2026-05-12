import { calcDASCountdown, formatCurrency } from '@/lib/utils'

const DAS_VALUE = 75.9

export function DASCard() {
  const days = calcDASCountdown()
  const urgent = days <= 5

  return (
    <div
      className={`rounded-xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
        urgent
          ? 'bg-amber-400/5 border-amber-400/30'
          : 'bg-white/[0.028] border-white/[0.07]'
      }`}
    >
      <div>
        <p className={`font-mono text-[10px] uppercase tracking-widest mb-1 ${urgent ? 'text-amber-400' : 'text-slate-500'}`}>
          ⚡ Próximo DAS
        </p>
        <p className="font-semibold text-slate-100 mb-1">Documento de Arrecadação do MEI</p>
        <p className="text-sm text-slate-400">Vencimento: todo dia 20 do mês</p>
        <p className="text-[11px] text-slate-600 mt-1 font-mono">
          Notificação automática enviada por e-mail 5 dias antes
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`font-mono text-4xl font-bold leading-none ${urgent ? 'text-amber-400' : 'text-slate-300'}`}>
          {days}
        </p>
        <p className="font-mono text-[10px] text-slate-500 mt-1">dias restantes</p>
        <p className="font-mono text-sm text-slate-300 mt-2">{formatCurrency(DAS_VALUE)}/mês</p>
      </div>
    </div>
  )
}
