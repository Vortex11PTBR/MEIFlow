'use client'

interface Transaction {
  id: string
  description: string
  amount: number
  type: 'INCOME' | 'EXPENSE'
  category: string
  date: string
}

function formatCurrency(v: number) {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function ExportButton({ transactions }: { transactions: Transaction[] }) {
  function exportCSV() {
    const header = 'Data,Tipo,Descrição,Categoria,Valor'
    const rows = transactions.map(tx => {
      const date = new Date(tx.date).toLocaleDateString('pt-BR')
      const type = tx.type === 'INCOME' ? 'Receita' : 'Despesa'
      const amount = tx.type === 'INCOME' ? tx.amount : -tx.amount
      return `${date},${type},"${tx.description}",${tx.category},${amount.toFixed(2)}`
    })
    const csv = [header, ...rows].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meiflow-transacoes-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={exportCSV}
      className="flex items-center gap-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 border border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-400/30 px-3 py-1.5 rounded-lg transition-all bg-white dark:bg-slate-800"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7,10 12,15 17,10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Exportar CSV
    </button>
  )
}
