'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'

export function NavActions() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <div className="w-28 h-8 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
  }

  if (session) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href="/app"
          className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
        >
          Dashboard
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
        >
          Sair
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/auth/entrar"
        className="text-sm text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors font-medium"
      >
        Entrar
      </Link>
      <Link
        href="/auth/cadastro"
        className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Criar conta
      </Link>
    </div>
  )
}
