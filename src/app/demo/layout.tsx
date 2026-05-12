import Link from 'next/link'
import { DemoNav } from '@/components/demo/DemoNav'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-[240px] shrink-0 bg-[#1E3A5F] sticky top-14 min-h-[calc(100vh-56px)] overflow-y-auto">
        {/* Logo + badge */}
        <div className="px-5 pt-6 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-7 h-7 bg-blue-500 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
              </svg>
            </span>
            <span className="font-bold text-white tracking-tight">MEIFlow</span>
          </div>
          <span className="inline-flex items-center gap-1.5 text-xs text-green-300 bg-green-400/10 border border-green-400/20 px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Demo ao vivo
          </span>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4">
          <p className="text-[11px] text-blue-200/50 uppercase tracking-wider px-5 mb-2 font-medium">Menu</p>
          <DemoNav />
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/10">
          <Link
            href="https://joaolacerda.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
              JL
            </div>
            <div>
              <p className="text-sm text-blue-100 group-hover:text-white transition-colors font-medium">João Lacerda</p>
              <p className="text-xs text-blue-300/60">joaolacerda.dev ↗</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0 bg-slate-50 dark:bg-slate-900">
        {children}
      </main>

      {/* ── Mobile Bottom Tab Bar ────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1E3A5F] border-t border-white/10">
        <DemoNav mobile />
      </nav>
    </div>
  )
}
