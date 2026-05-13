import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import { calcDASCountdown, formatCurrency } from '@/lib/utils'

export const revalidate = 3600

const DAS_VALUE = 75.9

interface TaxItem {
  name: string
  desc: string
  value: string
  info: string
}

const taxItems: TaxItem[] = [
  {
    name: 'INSS (Previdência Social)',
    desc: 'Contribuição para aposentadoria e benefícios do INSS',
    value: 'R$ 75,90/mês',
    info: '5% sobre o salário mínimo 2025 (R$ 1.518,00)',
  },
  {
    name: 'ICMS (Comércio/Indústria)',
    desc: 'Apenas para MEI que atua em comércio ou indústria',
    value: 'R$ 1,00/mês',
    info: 'Imposto sobre circulação de mercadorias',
  },
  {
    name: 'ISS (Serviços)',
    desc: 'Apenas para MEI que presta serviços',
    value: 'R$ 5,00/mês',
    info: 'Imposto sobre serviços de qualquer natureza',
  },
]

export default async function ImpostosPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.tenantId) redirect('/onboarding')

  const tenant = await prisma.tenant.findUnique({
    where: { id: session.user.tenantId },
    select: { cnpj: true },
  })

  if (!tenant?.cnpj) redirect('/onboarding')

  const days = calcDASCountdown()
  const urgent = days <= 5

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="animate-fade-in-up">
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Obrigações</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Central de Impostos</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Acompanhe e entenda os tributos do MEI</p>
      </div>

      <div className={`rounded-2xl p-6 border shadow-sm animate-fade-in-up ${urgent ? 'bg-amber-50 dark:bg-amber-400/5 border-amber-200 dark:border-amber-400/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${urgent ? 'bg-amber-100 dark:bg-amber-400/10 text-amber-700 dark:text-amber-400' : 'bg-blue-100 dark:bg-blue-400/10 text-blue-700 dark:text-blue-400'}`}>
                {urgent ? 'Vencimento próximo' : 'Em dia'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">DAS — Documento de Arrecadação do MEI</h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Vence todo dia 20 de cada mês. Pague via Meu INSS ou internet banking.</p>
            <div className="flex items-center gap-6 mt-3">
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Valor mensal</p>
                <p className="font-mono text-lg font-bold text-slate-800 dark:text-slate-200">{formatCurrency(DAS_VALUE)}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 dark:text-slate-500">Próximo vencimento</p>
                <p className="text-base font-semibold text-slate-700 dark:text-slate-300">Dia 20</p>
              </div>
            </div>
          </div>
          <div className={`text-center p-4 rounded-xl ${urgent ? 'bg-amber-100 dark:bg-amber-400/10' : 'bg-slate-100 dark:bg-slate-700'}`}>
            <p className={`font-mono text-5xl font-bold ${urgent ? 'text-amber-600 dark:text-amber-400' : 'text-slate-700 dark:text-slate-300'}`}>{days}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">dias restantes</p>
          </div>
        </div>
      </div>

      <div className="animate-fade-in-up">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-3">O que está incluído no DAS</p>
        <div className="space-y-3 stagger">
          {taxItems.map(item => (
            <div key={item.name} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.desc}</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 italic">{item.info}</p>
              </div>
              <span className="font-mono text-sm font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-400/10 border border-blue-200 dark:border-blue-400/20 px-3 py-1 rounded-lg shrink-0">
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm animate-fade-in-up">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Obrigações Anuais</p>
        <div className="space-y-3">
          {[
            {
              title: 'DASN-SIMEI (Declaração Anual)',
              deadline: 'Todo ano até 31 de maio',
              status: 'Obrigatório',
              desc: 'Declare seu faturamento anual no Portal do Empreendedor. Gratuito e simples.',
            },
            {
              title: 'Relatório Mensal de Receitas',
              deadline: 'Mês a mês',
              status: 'Recomendado',
              desc: 'Guarde os comprovantes de pagamento. Use o MEIFlow para exportar o CSV mensal.',
            },
          ].map(item => (
            <div key={item.title} className="flex items-start gap-4 p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <div className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 mt-0.5 ${item.status === 'Obrigatório' ? 'bg-red-100 dark:bg-red-400/10 text-red-700 dark:text-red-400' : 'bg-blue-100 dark:bg-blue-400/10 text-blue-700 dark:text-blue-400'}`}>
                {item.status}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{item.title}</p>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">{item.deadline}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 shadow-sm animate-fade-in-up">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 mb-4">Links Úteis — Receita Federal</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { name: 'Portal do Empreendedor', url: 'https://www.gov.br/empresas-e-negocios/pt-br/empreendedor', desc: 'Emitir DAS, declaração anual, certificado' },
            { name: 'App PGMEI', url: 'https://play.google.com/store/apps/details?id=br.gov.fazenda.receita.pgmei', desc: 'Pagar DAS pelo celular' },
            { name: 'Meu INSS', url: 'https://meu.inss.gov.br', desc: 'Consultar benefícios e contribuições' },
            { name: 'Nota Fiscal de Serviço', url: 'https://www.nfse.gov.br/', desc: 'Emitir NFS-e para seus clientes' },
          ].map(link => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl hover:bg-blue-50 dark:hover:bg-blue-400/5 border border-transparent hover:border-blue-200 dark:hover:border-blue-400/20 transition-all group"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400 mt-0.5 shrink-0">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
              <div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-700 dark:group-hover:text-blue-400 transition-colors">{link.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{link.desc}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
