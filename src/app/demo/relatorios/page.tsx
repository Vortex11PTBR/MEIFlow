import { getDashboardData } from '@/lib/dashboard'
import { DEMO_TENANT_CNPJ } from '@/lib/utils'
import { RelatoriosClient } from '@/components/demo/RelatoriosClient'

export const revalidate = 30

export default async function RelatoriosPage() {
  let data
  try {
    data = await getDashboardData(DEMO_TENANT_CNPJ)
  } catch {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm">Banco de dados não configurado.</p>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="animate-fade-in-up">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Análise</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Relatórios</h1>
      </div>
      <RelatoriosClient data={data} />
    </div>
  )
}
