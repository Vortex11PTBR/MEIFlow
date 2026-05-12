import Link from 'next/link'
import { DemoNav } from '@/components/demo/DemoNav'

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-56px)]">
      {/* ── Desktop Sidebar ─────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-[260px] shrink-0 border-r border-white/[0.06] bg-[#080c18] sticky top-14 h-[calc(100vh-56px)] overflow-y-auto">
        {/* Logo + badge */}
        <div className="px-5 pt-6 pb-4 border-b border-white/[0.05]">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,212,255,0.6)]" />
            <span className="font-mono font-bold text-slate-100 tracking-tight">MEIFlow</span>
          </div>
          <span className="inline-flex items-center gap-1.5 font-mono text-[10px] text-green-400 bg-green-400/10 border border-green-400/20 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            Demo ao vivo
          </span>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4">
          <p className="font-mono text-[9px] text-slate-600 uppercase tracking-[0.15em] px-6 mb-2">Navegação</p>
          <DemoNav />
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-white/[0.05]">
          <Link
            href="https://joaolacerda.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 group"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center text-[10px] font-bold text-bg shrink-0">
              JL
            </div>
            <div>
              <p className="font-mono text-[11px] text-slate-300 group-hover:text-cyan-400 transition-colors">João Lacerda</p>
              <p className="font-mono text-[9px] text-slate-600">joaolacerda.dev ↗</p>
            </div>
          </Link>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────── */}
      <main className="flex-1 min-w-0 pb-20 md:pb-0">
        {children}
      </main>

      {/* ── Mobile Bottom Tab Bar ────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080c18]/95 backdrop-blur-xl border-t border-white/[0.06]">
        <DemoNav mobile />
      </nav>
    </div>
  )
}
