import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/db'
import { DEMO_TENANT_CNPJ } from '@/lib/utils'
import { LancamentosClient } from '@/components/demo/LancamentosClient'

export const revalidate = 30

const getCachedTransactions = unstable_cache(
  async (tenantCnpj: string) => {
    const tenant = await prisma.tenant.findUnique({ where: { cnpj: tenantCnpj }, select: { id: true } })
    if (!tenant) return []
    const rows = await prisma.transaction.findMany({
      where: { tenantId: tenant.id },
      orderBy: { date: 'desc' },
      select: { id: true, description: true, amount: true, type: true, category: true, date: true, notes: true },
    })
    return rows.map(t => ({ ...t, date: t.date.toISOString() }))
  },
  ['demo-all-transactions'],
  { revalidate: 30, tags: ['dashboard'] }
)

export default async function LancamentosPage() {
  const transactions = await getCachedTransactions(DEMO_TENANT_CNPJ)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="animate-fade-in-up">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Histórico</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Lançamentos</h1>
      </div>
      <LancamentosClient transactions={transactions} />
    </div>
  )
}
