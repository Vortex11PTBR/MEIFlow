import { CNPJLookup } from '@/components/CNPJLookup'

const FEATURES = [
  {
    icon: '🤖',
    title: 'Categorização por IA',
    desc: 'Cada lançamento é categorizado automaticamente pelo Claude (Anthropic). Você digita a descrição — a IA faz o resto.',
  },
  {
    icon: '⚡',
    title: 'Alerta de DAS',
    desc: 'Notificação por e-mail automática 5 dias antes do vencimento via fila assíncrona. Nunca perca o DAS de novo.',
  },
  {
    icon: '🏦',
    title: 'API Receita Federal',
    desc: 'Consulte qualquer CNPJ em tempo real direto da base da Receita Federal. Dados oficiais e atualizados.',
  },
  {
    icon: '📊',
    title: 'Controle de limite',
    desc: 'Monitoramento em tempo real do limite anual de R$ 81 mil. Alerta quando você se aproxima do teto do MEI.',
  },
  {
    icon: '🏢',
    title: 'Multi-tenant',
    desc: 'Arquitetura profissional onde cada MEI tem seus dados completamente isolados com segurança garantida.',
  },
  {
    icon: '📋',
    title: 'Relatórios mensais',
    desc: 'Dashboard com breakdown mensal, gráficos de receita vs despesa e categorias de gastos. Zero planilha.',
  },
]

const TECH = [
  'Next.js 14 App Router',
  'TypeScript strict',
  'Prisma + Neon (PostgreSQL)',
  'Vercel Cron Jobs',
  'Claude AI (Anthropic)',
  'API Receita Federal',
  'Resend (e-mail)',
  'Tailwind CSS',
]

export default function HomePage() {
  return (
    <main className="max-w-6xl mx-auto px-6">
      {/* hero */}
      <section className="py-24 text-center">
        <div className="inline-flex items-center gap-2 font-mono text-xs text-cyan-400 border border-cyan-400/25 bg-cyan-400/5 px-4 py-1.5 rounded-full mb-8">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          Demo ao vivo — sem cadastro necessário
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold leading-tight mb-6">
          Gestão financeira{' '}
          <span className="text-cyan-400">inteligente</span>
          <br />
          para o MEI brasileiro
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-10">
          São <strong className="text-slate-200">15 milhões de MEIs</strong> no Brasil controlando finanças em caderno e WhatsApp.
          MEIFlow é a solução simples, bonita e construída do zero para a realidade de quem trabalha sozinho.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href="/demo"
            className="bg-cyan-400 text-bg font-mono font-bold px-8 py-4 rounded-xl text-sm hover:shadow-[0_0_32px_rgba(0,212,255,0.4)] transition-all"
          >
            Ver dashboard demo →
          </a>
          <a
            href="https://github.com/Vortex11PTBR/MEIFlow"
            target="_blank"
            rel="noopener noreferrer"
            className="border border-white/[0.12] text-slate-300 font-mono text-sm px-8 py-4 rounded-xl hover:border-white/30 transition-all"
          >
            GitHub — código aberto
          </a>
        </div>
      </section>

      {/* features */}
      <section className="py-12">
        <p className="font-mono text-[11px] text-slate-500 uppercase tracking-widest text-center mb-10">
          O que o MEIFlow resolve
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(f => (
            <div
              key={f.title}
              className="bg-white/[0.028] border border-white/[0.07] rounded-xl p-5 hover:border-cyan-400/20 hover:bg-white/[0.04] transition-all"
            >
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-slate-100 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* live CNPJ lookup */}
      <section className="py-12">
        <div className="bg-white/[0.02] border border-white/[0.07] rounded-2xl p-8">
          <div className="mb-6 text-center">
            <p className="font-mono text-[11px] text-slate-500 uppercase tracking-widest mb-2">Teste agora — gratuito</p>
            <h2 className="text-2xl font-bold text-slate-100">Consulta de CNPJ ao vivo</h2>
            <p className="text-slate-400 text-sm mt-2">
              API pública da Receita Federal — sem autenticação, dados reais
            </p>
          </div>
          <CNPJLookup />
        </div>
      </section>

      {/* stack */}
      <section className="py-12 pb-4">
        <p className="font-mono text-[11px] text-slate-500 uppercase tracking-widest text-center mb-8">Stack técnica</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {TECH.map(t => (
            <span
              key={t}
              className="font-mono text-xs text-slate-300 border border-white/[0.1] bg-white/[0.03] px-3 py-1.5 rounded-full"
            >
              {t}
            </span>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="bg-gradient-to-r from-cyan-400/5 via-purple-400/5 to-cyan-400/5 border border-cyan-400/10 rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-slate-100 mb-3">Dashboard com dados reais</h2>
          <p className="text-slate-400 mb-6">
            5 meses de lançamentos, categorização por IA, limite MEI e alerta de DAS. Tudo funcionando.
          </p>
          <a
            href="/demo"
            className="inline-block bg-cyan-400 text-bg font-mono font-bold px-8 py-4 rounded-xl text-sm hover:shadow-[0_0_32px_rgba(0,212,255,0.4)] transition-all"
          >
            Abrir demo →
          </a>
        </div>
      </section>
    </main>
  )
}
