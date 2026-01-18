'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface NavProps {
  entryCount?: number
}

export default function Nav({ entryCount = 0 }: NavProps) {
  const pathname = usePathname()
  const supabase = createClient()

  const handleSignOut = async () => {
    await fetch('/api/auth/signout', { method: 'POST' })
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/data', label: 'Data' },
  ]

  return (
    <nav className="border-b border-zinc-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-4 sm:space-x-8">
            <h1 className="text-xl font-semibold text-zinc-900">Finance Dashboard</h1>
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.href
                      ? 'text-zinc-900 border-b-2 border-zinc-900'
                      : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {entryCount > 0 && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-200 text-zinc-800">
                {entryCount} {entryCount === 1 ? 'entry' : 'entries'}
              </span>
            )}
          </div>
          <button
            onClick={handleSignOut}
            className="cursor-pointer text-sm font-medium text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </nav>
  )
}