'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV_ITEMS = [
  {
    href: '/demo',
    label: 'Visão Geral',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    href: '/demo/lancamentos',
    label: 'Lançamentos',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="8" y1="6" x2="21" y2="6" />
        <line x1="8" y1="12" x2="21" y2="12" />
        <line x1="8" y1="18" x2="21" y2="18" />
        <line x1="3" y1="6" x2="3.01" y2="6" />
        <line x1="3" y1="12" x2="3.01" y2="12" />
        <line x1="3" y1="18" x2="3.01" y2="18" />
      </svg>
    ),
  },
  {
    href: '/demo/relatorios',
    label: 'Relatórios',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    ),
  },
]

export function DemoNav({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname()

  if (mobile) {
    return (
      <div className="flex items-center justify-around h-16 px-4">
        {NAV_ITEMS.map(item => {
          const isActive = item.href === '/demo' ? pathname === '/demo' : pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-1 transition-colors ${
                isActive ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {item.icon}
              <span className="font-mono text-[9px] uppercase tracking-wider">{item.label}</span>
            </Link>
          )
        })}
      </div>
    )
  }

  return (
    <nav className="flex flex-col gap-0.5 px-3">
      {NAV_ITEMS.map(item => {
        const isActive = item.href === '/demo' ? pathname === '/demo' : pathname.startsWith(item.href)
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all font-mono text-sm ${
              isActive
                ? 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
