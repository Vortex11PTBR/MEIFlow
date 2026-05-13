'use client'

import { useState } from 'react'

interface CNPJData {
  cnpj: string
  razaoSocial: string
  nomeFantasia: string | null
  situacao: string
  ativa: boolean
  abertura: string | null
  municipio: string | null
  uf: string | null
  natureza: string | null
  porte: string | null
  cnae: string | null
  email: string | null
}

function formatCNPJInput(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 14)
  if (d.length > 12) return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  if (d.length > 8) return d.replace(/^(\d{2})(\d{3})(\d{3})(\d+)$/, '$1.$2.$3/$4')
  if (d.length > 5) return d.replace(/^(\d{2})(\d{3})(\d+)$/, '$1.$2.$3')
  if (d.length > 2) return d.replace(/^(\d{2})(\d+)$/, '$1.$2')
  return d
}

export function CNPJLookup() {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CNPJData | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function lookup() {
    const clean = value.replace(/\D/g, '')
    if (clean.length !== 14) { setError('CNPJ inválido. Digite os 14 dígitos.'); return }
    setLoading(true); setError(null); setResult(null)
    try {
      const res = await fetch(`/api/cnpj/${clean}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Erro')
      setResult(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro desconhecido')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="flex gap-3 flex-col sm:flex-row">
        <input
          type="text"
          value={value}
          placeholder="00.000.000/0001-00"
          maxLength={18}
          onChange={e => setValue(formatCNPJInput(e.target.value))}
          onKeyDown={e => e.key === 'Enter' && lookup()}
          className="flex-1 bg-bg-3 border border-white/[0.07] focus:border-cyan/40 focus:ring-1 focus:ring-cyan/20 rounded-lg px-4 py-3 font-mono text-sm text-slate-100 placeholder:text-slate-600 outline-none transition-all"
        />
        <button
          onClick={lookup}
          disabled={loading}
          className="bg-cyan-400 text-bg font-mono font-semibold text-sm px-6 py-3 rounded-lg hover:shadow-[0_0_24px_rgba(0,212,255,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
        >
          {loading ? 'Consultando...' : 'Consultar Receita Federal →'}
        </button>
      </div>

      {loading && (
        <div className="flex items-center gap-3 mt-4 font-mono text-sm text-slate-400">
          <div className="w-4 h-4 border-2 border-white/10 border-t-cyan-400 rounded-full animate-spin" />
          Consultando API da Receita Federal...
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-400/5 border border-red-400/30 rounded-lg font-mono text-sm text-red-400">
          ⚠ {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-5 bg-white/[0.028] border border-cyan-400/30 rounded-xl animate-fadeUp">
          <div className="flex items-start gap-3 mb-5 pb-4 border-b border-white/[0.07]">
            <div>
              <h3 className="font-semibold text-slate-100 text-base">
                {result.nomeFantasia ?? result.razaoSocial}
                {result.nomeFantasia && result.nomeFantasia !== result.razaoSocial && (
                  <span className="text-slate-500 text-sm font-normal ml-2">({result.razaoSocial})</span>
                )}
              </h3>
              <span
                className={`inline-flex items-center gap-1.5 font-mono text-xs mt-2 px-2 py-0.5 rounded-full border ${
                  result.ativa
                    ? 'text-green-400 border-green-400/30 bg-green-400/10'
                    : 'text-red-400 border-red-400/30 bg-red-400/10'
                }`}
              >
                ● {result.situacao}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: 'CNPJ', value: result.cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5') },
              { label: 'Natureza Jurídica', value: result.natureza },
              { label: 'Porte', value: result.porte },
              { label: 'Início de Atividade', value: result.abertura },
              { label: 'Município / UF', value: result.municipio && result.uf ? `${result.municipio} / ${result.uf}` : null },
              { label: 'CNAE Principal', value: result.cnae },
              ...(result.email ? [{ label: 'E-mail', value: result.email }] : []),
            ].map(({ label, value }) =>
              value ? (
                <div key={label}>
                  <p className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">{label}</p>
                  <p className="text-sm text-slate-200 mt-0.5">{value}</p>
                </div>
              ) : null,
            )}
          </div>
          <div className="mt-4 p-3 bg-green-400/5 border border-green-400/20 rounded-lg">
            <p className="font-mono text-[10px] text-green-400">
              ✓ Dados importados da API pública da Receita Federal
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
