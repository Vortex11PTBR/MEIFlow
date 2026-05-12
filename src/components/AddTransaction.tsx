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
    <form onSubmit={submit} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.12em]">Novo Lançamento</p>
        {aiLoading && (
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 border-2 border-white/10 border-t-purple-400 rounded-full animate-spin" />
            <span className="font-mono text-[10px] text-purple-400">categorizando com IA...</span>
          </div>
        )}
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-400/10 border border-green-400/30 rounded-lg font-mono text-sm text-green-400">
          ✓ Lançamento adicionado com sucesso!
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-400/10 border border-red-400/30 rounded-lg font-mono text-sm text-red-400">
          ⚠ {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div className="md:col-span-2">
          <label className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Descrição</label>
          <div className="relative">
            <input
              required
              value={description}
              onChange={e => setDescription(e.target.value)}
              onBlur={e => suggestCategory(e.target.value)}
              placeholder="Ex: Projeto de desenvolvimento web"
              className="w-full bg-bg-3 border border-white/[0.07] focus:border-cyan/40 rounded-lg px-4 py-3 font-mono text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all"
            />
            {aiLoading && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-white/10 border-t-purple-400 rounded-full animate-spin" />
            )}
          </div>
          {aiCategory && (
            <p className="font-mono text-[10px] text-purple-400 mt-1">✦ IA sugeriu: <strong>{aiCategory}</strong></p>
          )}
        </div>

        <div>
          <label className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Valor (R$)</label>
          <input
            required
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="0,00"
            className="w-full bg-bg-3 border border-white/[0.07] focus:border-cyan/40 rounded-lg px-4 py-3 font-mono text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all"
          />
        </div>

        <div>
          <label className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Tipo</label>
          <div className="flex">
            {(['INCOME', 'EXPENSE'] as const).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`flex-1 py-3 font-mono text-xs font-semibold border transition-all first:rounded-l-lg last:rounded-r-lg ${
                  type === t
                    ? t === 'INCOME'
                      ? 'bg-green-400 text-bg border-green-400'
                      : 'bg-red-400 text-bg border-red-400'
                    : 'bg-transparent border-white/[0.07] text-slate-500 hover:border-white/20'
                }`}
              >
                {t === 'INCOME' ? '+ Receita' : '− Despesa'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Categoria</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="w-full bg-bg-3 border border-white/[0.07] focus:border-cyan/40 rounded-lg px-4 py-3 font-mono text-sm text-slate-100 outline-none transition-all"
          >
            <option value="">IA vai sugerir automaticamente</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block mb-1">Data</label>
          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            className="w-full bg-bg-3 border border-white/[0.07] focus:border-cyan/40 rounded-lg px-4 py-3 font-mono text-sm text-slate-100 outline-none transition-all"
          />
        </div>

        <div className="md:col-span-2">
          <label className="font-mono text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
            Observações <span className="text-slate-600">(opcional)</span>
          </label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="Anotações sobre este lançamento..."
            rows={2}
            className="w-full bg-bg-3 border border-white/[0.07] focus:border-cyan/40 rounded-lg px-4 py-3 font-mono text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all resize-none"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="mt-4 w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-bg font-mono font-bold text-sm py-3 rounded-lg hover:shadow-[0_0_24px_rgba(0,212,255,0.3)] transition-all disabled:opacity-50"
      >
        {isPending ? 'Salvando com IA...' : 'Adicionar Lançamento'}
      </button>
    </form>
  )
}
