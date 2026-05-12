'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter } from 'next/navigation'

const CATEGORIES = [
  'Serviços','Marketing','Transporte','Alimentação','Equipamento',
  'Ferramentas','Educação','Infraestrutura','Escritório','Impostos',
  'Manutenção','Saúde','Treinamento','Outros',
]

export function AddTransaction() {
  const router = useRouter()
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<'INCOME' | 'EXPENSE'>('INCOME')
  const [category, setCategory] = useState('')
  const [notes, setNotes] = useState('')
  const [aiCategory, setAICategory] = useState<string | null>(null)
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0])
  const [isPending, startTransition] = useTransition()
  const [aiLoading, setAILoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const suggestCategory = useCallback(async (desc: string) => {
    if (desc.length < 3) return
    setAILoading(true)
    try {
      const res = await fetch('/api/categorize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: desc }),
      })
      const data = await res.json()
      if (data.category) {
        setAICategory(data.category)
        setCategory(prev => prev || data.category)
      }
    } catch { /* ignore */ } finally { setAILoading(false) }
  }, [])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      setError(null)
      try {
        const res = await fetch('/api/transactions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            description,
            amount: parseFloat(amount.replace(',', '.')),
            type,
            category: category || aiCategory || 'Outros',
            date,
            notes: notes.trim() || undefined,
          }),
        })
        if (!res.ok) throw new Error((await res.json()).error ?? 'Erro')
        setSuccess(true)
        router.refresh()
        setTimeout(() => setSuccess(false), 2500)
        setDescription('')
        setAmount('')
        setNotes('')
        setAICategory(null)
        setCategory('')
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erro')
      }
    })
  }

  return (
    <form onSubmit={submit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Novo Lançamento</p>
        {aiLoading && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 border-2 border-slate-200 dark:border-white/10 border-t-blue-500 rounded-full animate-spin" />
            <span className="text-xs text-blue-600 dark:text-blue-400">categorizando com IA...</span>
          </div>
        )}
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 dark:bg-green-400/10 border border-green-200 dark:border-green-400/30 rounded-lg text-sm text-green-700 dark:text-green-400">
          ✓ Lançamento adicionado com sucesso!
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-400/10 border border-red-200 dark:border-red-400/30 rounded-lg text-sm text-red-700 dark:text-red-400">
          ⚠ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Descrição</label>
          <div className="relative">
            <input
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              onBlur={e => suggestCategory(e.target.value)}
              placeholder="Ex: Projeto de desenvolvimento web"
              className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all"
            />
            {aiLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-slate-200 dark:border-white/10 border-t-blue-500 rounded-full animate-spin" />
            )}
          </div>
          {aiCategory && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">✦ IA sugeriu: <strong>{aiCategory}</strong></p>
          )}
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Valor (R$)</label>
          <input
            required
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0,00"
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg px-4 py-3 font-mono text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all"
          />
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Tipo</label>
          <div className="flex">
            {(['INCOME', 'EXPENSE'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-3 text-xs font-semibold border transition-all first:rounded-l-lg last:rounded-r-lg ${
                  type === t
                    ? t === 'INCOME'
                      ? 'bg-green-600 text-white border-green-600'
                      : 'bg-red-600 text-white border-red-600'
                    : 'bg-transparent border-slate-300 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-slate-400'
                }`}
              >
                {t === 'INCOME' ? '+ Receita' : '− Despesa'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Categoria</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition-all"
          >
            <option value="">IA vai sugerir automaticamente</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">Data</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-slate-100 outline-none transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-xs font-medium text-slate-600 dark:text-slate-400 block mb-1">
            Observações <span className="text-slate-400 dark:text-slate-500">(opcional)</span>
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Anotações sobre este lançamento..."
            rows={2}
            className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 focus:border-blue-500 dark:focus:border-blue-400 rounded-lg px-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none transition-all resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Salvando com IA...' : 'Adicionar Lançamento'}
      </button>
    </form>
  )
}
