'use client'

import { useState } from 'react'
import { AddClientModal } from '@/components/AddClientModal'

interface Client {
  id: string
  name: string
  email: string | null
  phone: string | null
  cnpj: string | null
}

export function ClientesContent({ clients }: { clients: Client[] }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in-up">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Cadastro</p>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Clientes</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Gerencie seus clientes e histórico de serviços</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-lg shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
            {clients.length} {clients.length === 1 ? 'cliente' : 'clientes'}
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Novo Cliente
          </button>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-400/10 border border-blue-200 dark:border-blue-400/20 rounded-xl p-4 animate-fade-in-up">
        <p className="text-sm font-medium text-blue-800 dark:text-blue-300">Como funciona</p>
        <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
          Mantenha o cadastro dos seus clientes atualizado. Assim fica mais fácil registrar pagamentos, emitir notas e acompanhar quem te deve.
        </p>
      </div>

      {clients.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-12 text-center shadow-sm animate-fade-in-up">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Nenhum cliente cadastrado</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 mb-5">Adicione seus clientes para organizar melhor seus recebimentos</p>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Adicionar primeiro cliente
          </button>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden shadow-sm animate-fade-in-up">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                  {['Cliente', 'E-mail', 'Telefone', 'CNPJ/CPF'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {clients.map((client, i) => (
                  <tr
                    key={client.id}
                    className={`border-b border-slate-100 dark:border-slate-700/50 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors ${i % 2 === 0 ? '' : 'bg-slate-50/50 dark:bg-slate-900/20'}`}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-400/10 flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-blue-700 dark:text-blue-300">{client.name.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{client.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400">{client.email ?? '—'}</td>
                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{client.phone ?? '—'}</td>
                    <td className="px-5 py-4 text-sm text-slate-600 dark:text-slate-400 font-mono">{client.cnpj ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm animate-fade-in-up">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">Boas práticas para MEI</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { title: 'Mantenha contatos atualizados', desc: 'Facilita cobranças e envio de notas fiscais.' },
            { title: 'Registre o CNPJ do cliente', desc: 'Necessário para emissão de nota fiscal de serviço.' },
            { title: 'Acompanhe pagamentos', desc: 'Sempre registre quando o cliente efetuar pagamento.' },
            { title: 'Use contratos simples', desc: 'Mesmo que seja simples, tenha algo por escrito com o cliente.' },
          ].map(tip => (
            <div key={tip.title} className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-400/10 flex items-center justify-center shrink-0 mt-0.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{tip.title}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tip.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showModal && <AddClientModal onClose={() => setShowModal(false)} />}
    </div>
  )
}
