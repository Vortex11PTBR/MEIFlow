import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { DemoNav } from '@/components/demo/DemoNav'
import { ThemeToggle } from '@/components/ThemeToggle'
import { authOptions } from '@/lib/auth'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions)

  if (!session) redirect('/auth/entrar')
  if (!session.user.tenantId) redirect('/onboarding')

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
      <aside className="hidden lg:flex flex-col w-56 shrink-0 bg-[#1E3A5F] dark:bg-[#0f1f35] border-r border-[#1a3352]">
        <div className="h-14 flex items-center px-5 border-b border-[#1a3352]">
          <a href="/" className="flex items-center gap-2">
            <span className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            </span>
            <span className="font-bold text-white tracking-tight">MEI<span className="text-blue-400">Flow</span></span>
          </a>
        </div>
        <nav className="flex-1 py-4">
          <DemoNav basePath="/app" />
        </nav>
        <div className="p-4 border-t border-[#1a3352] space-y-2">
          <p className="text-xs text-blue-300/60 truncate">{session.user.email}</p>
          <a href="/api/auth/signout" className="text-xs text-blue-300/60 hover:text-blue-300 transition-colors block">
            Sair
          </a>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-14 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex items-center justify-between px-4 lg:px-6">
          <div className="lg:hidden">
            <DemoNav basePath="/app" mobile />
          </div>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </header>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
