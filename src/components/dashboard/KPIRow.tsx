'use client'

import { formatCurrency } from '@/lib/utils'

interface KPI {
  label: string
  value: number
  isCurrency?: boolean
  color: 'green' | 'red' | 'cyan' | 'amber'
  delta?: string
  deltaUp?: boolean
}

export function KPIRow({ kpis }: { kpis: KPI[] }) {
  const colorMap = {
    green: 'text-green-400',
    red: 'text-red-400',
    cyan: 'text-cyan-400',
    amber: 'text-amber-400',
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {kpis.map(kpi => (
        <div
          key={kpi.label}
          className="bg-white/[0.028] border border-white/[0.07] rounded-xl p-4 hover:bg-white/[0.05] hover:border-cyan/20 transition-all"
        >
          <p className="font-mono text-[10px] text-slate-500 uppercase tracking-widest mb-2">{kpi.label}</p>
          <p className={`font-mono text-xl font-bold ${colorMap[kpi.color]}`}>
            {kpi.isCurrency ? formatCurrency(kpi.value) : kpi.value.toLocaleString('pt-BR')}
          </p>
          {kpi.delta && (
            <p className={`font-mono text-[10px] mt-1 ${kpi.deltaUp ? 'text-green-400' : 'text-red-400'}`}>
              {kpi.deltaUp ? '↑' : '↓'} {kpi.delta}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}
