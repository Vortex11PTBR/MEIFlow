import { calcDASCountdown, formatCurrency } from '@/lib/utils'

const DAS_VALUE = 75.9

export function DASCard() {
  const days = calcDASCountdown()
  const urgent = days <= 5

  return (
    <div
      className={`rounded-xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm ${
        urgent
          ? 'bg-amber-50 dark:bg-amber-400/5 border-amber-200 dark:border-amber-400/30'
          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
      }`}
    >
      <div>
        <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${urgent ? 'text-amber-600 dark:text-amber-400' : 'text-slate-500 dark:text-slate-400'}`}>
          ⚡ Próximo DAS
        </p>
        <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">Documento de Arrecadação do MEI</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">Vencimento: todo dia 20 do mês</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
          Notificação automática enviada por e-mail 5 dias antes
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className={`font-mono text-4xl font-bold leading-none ${urgent ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>
          {days}
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">dias restantes</p>
        <p className="font-mono text-sm text-slate-700 dark:text-slate-300 mt-2">{formatCurrency(DAS_VALUE)}/mês</p>
      </div>
    </div>
  )
}
