import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'MEIFlow — Gestão Financeira para MEI',
  description:
    'SaaS de gestão financeira para Microempreendedores Individuais. Controle de receitas, despesas, clientes e DAS. Categorização por IA e alerta de limite anual.',
  openGraph: {
    title: 'MEIFlow',
    description: 'Gestão financeira simples e inteligente para o MEI brasileiro.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className={inter.className}>
        <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-bg/80 backdrop-blur-xl">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <a href="/" className="font-mono font-bold text-cyan-400 tracking-tight">
              MEI<span className="text-slate-400">Flow</span>
            </a>
            <div className="flex items-center gap-4">
              <a
                href="/demo"
                className="font-mono text-xs text-slate-300 hover:text-cyan-400 transition-colors"
              >
                demo
              </a>
              <a
                href="https://joaolacerda.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-slate-500 hover:text-slate-300 transition-colors"
              >
                portfólio →
              </a>
            </div>
          </div>
        </nav>
        {children}
        <footer className="border-t border-white/[0.05] mt-20 py-8">
          <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="font-mono text-[11px] text-slate-600">
              MEIFlow by{' '}
              <a
                href="https://joaolacerda.dev"
                className="text-cyan-400 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                João Lacerda
              </a>
            </p>
            <p className="font-mono text-[11px] text-slate-600">
              Next.js · Prisma · Neon · IA · Receita Federal
            </p>
          </div>
        </footer>
      </body>
    </html>
  )
}
