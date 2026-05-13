'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

function formatCNPJ(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 14)
  return d
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2}\.\d{3})(\d)/, '$1.$2')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
}

type CNPJData = {
  cnpj: string
  razaoSocial: string
  nomeFantasia: string | null
  situacao: string
  porte: string
}

export default function OnboardingPage() {
  const { update } = useSession()
  const router = useRouter()
  const [cnpj, setCnpj] = useState('')
  const [cnpjData, setCnpjData] = useState<CNPJData | null>(null)
  const [step, setStep] = useState<'input' | 'manual' | 'confirm' | 'done'>('input')
  const [manualRazao, setManualRazao] = useState('')
  const [manualFantasia, setManualFantasia] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleValidate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const raw = cnpj.replace(/\D/g, '')

    try {
      const res = await fetch(`/api/cnpj/${raw}`)
      const data = await res.json()

      if (!res.ok) {
        // API failed — fall back to manual entry
        setStep('manual')
        setLoading(false)
        return
      }

      if (data.situacao !== 'ATIVA') {
        setError(`Este CNPJ está ${data.situacao}. Somente CNPJs ativos podem usar o MEIFlow.`)
        setLoading(false)
        return
      }

      setCnpjData(data)
      setStep('confirm')
    } catch {
      // Network error — fall back to manual entry
      setStep('manual')
    }

    setLoading(false)
  }

  function handleManualConfirm(e: React.FormEvent) {
    e.preventDefault()
    const raw = cnpj.replace(/\D/g, '')
    setCnpjData({
      cnpj: raw,
      razaoSocial: manualRazao.trim(),
      nomeFantasia: manualFantasia.trim() || null,
      situacao: 'ATIVA',
      porte: 'MEI',
    })
    setStep('confirm')
  }

  async function handleConfirm() {
    if (!cnpjData) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cnpj: cnpjData.cnpj.replace(/\D/g, ''),
          razaoSocial: cnpjData.razaoSocial,
          nomeFantasia: cnpjData.nomeFantasia,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Erro ao configurar conta.')
        setLoading(false)
        return
      }

      await update()
      setStep('done')
      setTimeout(() => router.push('/app'), 1500)
    } catch {
      setError('Erro ao configurar conta. Tente novamente.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </span>
            <span className="font-bold text-xl text-slate-900 dark:text-slate-100">MEI<span className="text-blue-600">Flow</span></span>
          </a>
          {step === 'input' && (
            <>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Configure sua conta</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Informe seu CNPJ para começar</p>
            </>
          )}
          {step === 'manual' && (
            <>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Dados da empresa</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Não encontramos seu CNPJ automaticamente. Preencha manualmente.</p>
            </>
          )}
          {step === 'confirm' && (
            <>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Confirme seus dados</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Verifique as informações antes de continuar</p>
            </>
          )}
          {step === 'done' && (
            <>
              <h1 className="text-2xl font-bold text-green-600">Tudo pronto!</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Redirecionando para seu painel...</p>
            </>
          )}
        </div>

        {step === 'input' && (
          <form onSubmit={handleValidate} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-4">
            {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CNPJ</label>
              <input
                type="text"
                value={cnpj}
                onChange={e => setCnpj(formatCNPJ(e.target.value))}
                required
                placeholder="00.000.000/0001-00"
                maxLength={18}
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm font-mono"
              />
              <p className="text-xs text-slate-400 mt-1.5">Vamos buscar seus dados na Receita Federal automaticamente.</p>
            </div>
            <button type="submit" disabled={loading || cnpj.replace(/\D/g, '').length < 14} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
              {loading ? 'Consultando...' : 'Buscar CNPJ'}
            </button>
          </form>
        )}

        {step === 'manual' && (
          <form onSubmit={handleManualConfirm} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-4">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg text-sm text-amber-700 dark:text-amber-400">
              CNPJ <span className="font-mono font-medium">{cnpj}</span> — preencha os dados manualmente para continuar.
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Razão Social <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={manualRazao}
                onChange={e => setManualRazao(e.target.value)}
                required
                placeholder="Ex: JOÃO SILVA SERVIÇOS"
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Fantasia <span className="text-slate-400">(opcional)</span></label>
              <input
                type="text"
                value={manualFantasia}
                onChange={e => setManualFantasia(e.target.value)}
                placeholder="Ex: João Silva Serviços"
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm"
              />
            </div>
            <div className="flex gap-3">
              <button type="button" onClick={() => { setStep('input'); setError('') }} className="flex-1 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium py-2.5 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Voltar
              </button>
              <button type="submit" disabled={!manualRazao.trim()} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                Continuar
              </button>
            </div>
          </form>
        )}

        {step === 'confirm' && cnpjData && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-4">
            {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">{error}</div>}
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400">CNPJ</span>
                <span className="text-sm font-mono font-medium text-slate-900 dark:text-slate-100">{cnpjData.cnpj}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400">Razão Social</span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100 text-right max-w-[200px]">{cnpjData.razaoSocial}</span>
              </div>
              {cnpjData.nomeFantasia && (
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Nome Fantasia</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{cnpjData.nomeFantasia}</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Situação</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">{cnpjData.situacao}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setStep('input'); setCnpjData(null) }} className="flex-1 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium py-2.5 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Voltar
              </button>
              <button onClick={handleConfirm} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                {loading ? 'Configurando...' : 'Confirmar e entrar'}
              </button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="bg-white dark:bg-slate-800 border border-green-200 dark:border-green-800 rounded-2xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Sua conta está configurada e pronta para usar.</p>
          </div>
        )}
      </div>
    </div>
  )
}

type CNPJData = {
  cnpj: string
  razaoSocial: string
  nomeFantasia: string | null
  situacao: string
  porte: string
}

export default function OnboardingPage() {
  const { update } = useSession()
  const router = useRouter()
  const [cnpj, setCnpj] = useState('')
  const [cnpjData, setCnpjData] = useState<CNPJData | null>(null)
  const [step, setStep] = useState<'input' | 'confirm' | 'done'>('input')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleValidate(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const raw = cnpj.replace(/\D/g, '')

    try {
      const res = await fetch(`/api/cnpj/${raw}`)
      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'CNPJ não encontrado.')
        setLoading(false)
        return
      }

      if (data.situacao !== 'ATIVA') {
        setError(`Este CNPJ está ${data.situacao}. Somente CNPJs ativos podem usar o MEIFlow.`)
        setLoading(false)
        return
      }

      setCnpjData(data)
      setStep('confirm')
    } catch {
      setError('Erro ao consultar CNPJ. Tente novamente.')
    }

    setLoading(false)
  }

  async function handleConfirm() {
    if (!cnpjData) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cnpj: cnpjData.cnpj.replace(/\D/g, ''),
          razaoSocial: cnpjData.razaoSocial,
          nomeFantasia: cnpjData.nomeFantasia,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error ?? 'Erro ao configurar conta.')
        setLoading(false)
        return
      }

      await update()
      setStep('done')
      setTimeout(() => router.push('/app'), 1500)
    } catch {
      setError('Erro ao configurar conta. Tente novamente.')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <a href="/" className="inline-flex items-center gap-2 mb-6">
            <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </span>
            <span className="font-bold text-xl text-slate-900 dark:text-slate-100">MEI<span className="text-blue-600">Flow</span></span>
          </a>
          {step === 'input' && (
            <>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Configure sua conta</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Informe seu CNPJ para começar</p>
            </>
          )}
          {step === 'confirm' && (
            <>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Confirme seus dados</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Encontramos sua empresa na Receita Federal</p>
            </>
          )}
          {step === 'done' && (
            <>
              <h1 className="text-2xl font-bold text-green-600">Tudo pronto!</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Redirecionando para seu painel...</p>
            </>
          )}
        </div>

        {step === 'input' && (
          <form onSubmit={handleValidate} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-4">
            {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">CNPJ</label>
              <input
                type="text"
                value={cnpj}
                onChange={e => setCnpj(formatCNPJ(e.target.value))}
                required
                placeholder="00.000.000/0001-00"
                maxLength={18}
                className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-sm font-mono"
              />
              <p className="text-xs text-slate-400 mt-1.5">Vamos buscar seus dados na Receita Federal automaticamente.</p>
            </div>
            <button type="submit" disabled={loading || cnpj.replace(/\D/g, '').length < 14} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
              {loading ? 'Consultando...' : 'Buscar CNPJ'}
            </button>
          </form>
        )}

        {step === 'confirm' && cnpjData && (
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 shadow-sm space-y-4">
            {error && <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-sm text-red-700 dark:text-red-400">{error}</div>}
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400">CNPJ</span>
                <span className="text-sm font-mono font-medium text-slate-900 dark:text-slate-100">{cnpjData.cnpj}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                <span className="text-sm text-slate-500 dark:text-slate-400">Razão Social</span>
                <span className="text-sm font-medium text-slate-900 dark:text-slate-100 text-right max-w-[200px]">{cnpjData.razaoSocial}</span>
              </div>
              {cnpjData.nomeFantasia && (
                <div className="flex justify-between py-2 border-b border-slate-100 dark:border-slate-700">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Nome Fantasia</span>
                  <span className="text-sm font-medium text-slate-900 dark:text-slate-100">{cnpjData.nomeFantasia}</span>
                </div>
              )}
              <div className="flex justify-between py-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">Situação</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">{cnpjData.situacao}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => { setStep('input'); setCnpjData(null) }} className="flex-1 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 font-medium py-2.5 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                Voltar
              </button>
              <button onClick={handleConfirm} disabled={loading} className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm">
                {loading ? 'Configurando...' : 'Confirmar e entrar'}
              </button>
            </div>
          </div>
        )}

        {step === 'done' && (
          <div className="bg-white dark:bg-slate-800 border border-green-200 dark:border-green-800 rounded-2xl p-8 shadow-sm text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Sua conta está configurada e pronta para usar.</p>
          </div>
        )}
      </div>
    </div>
  )
}
