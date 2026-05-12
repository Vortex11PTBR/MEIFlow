import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const jetbrains = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' })

export const metadata: Metadata = {
  title: 'MEIFlow — Gestão Financeira para MEI',
  description: 'SaaS de gestão financeira para Microempreendedores Individuais. Controle de receitas, despesas, clientes e DAS. Categorização por IA e alerta de limite anual.',
  openGraph: {
    title: 'MEIFlow',
    description: 'Gestão financeira simples e inteligente para o MEI brasileiro.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <body className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 font-sans antialiased">
        <ThemeProvider>
          <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl">
            <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
              <a href="/" className="flex items-center gap-2">
                <span className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100 tracking-tight text-lg">
                  MEI<span className="text-blue-600">Flow</span>
                </span>
              </a>
              <div className="flex items-center gap-3">
                <a href="/demo" className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium">
                  Demo
                </a>
                <a href="https://joaolacerda.dev" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                  Portfólio ↗
                </a>
                <ThemeToggle />
              </div>
            </div>
          </nav>
          {children}
          <footer className="border-t border-slate-200 dark:border-slate-800 mt-20 py-8">
            <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                MEIFlow by{' '}
                <a href="https://joaolacerda.dev" className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                  João Lacerda
                </a>
              </p>
              <p className="text-sm text-slate-400">
                Next.js · Prisma · Neon · IA · Receita Federal
              </p>
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}
